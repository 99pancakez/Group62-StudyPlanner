const {
  Course,
  RequisiteRule,
  RequisiteGroup,
  Requisite,
  History,
  sequelize,
} = require("../database");

const RELATIONS = ["prerequisite", "corequisite"];

function normalizeRequisites(requisites) {
  return (Array.isArray(requisites) ? requisites : [])
    .map((group) => ({
      relation:
        group.relation === "corequisite" ? "corequisite" : "prerequisite",
      courses: (Array.isArray(group.courses) ? group.courses : [])
        .map((c) => String(c).trim())
        .filter(Boolean),
    }))
    .filter((group) => group.courses.length > 0);
}

// Internal: OR-groups -> [{ relation, courses }], projecting the requested field.
function toRelationGroups(orGroups, field) {
  return orGroups
    .map((group) => ({
      relation: group.requisites?.[0]?.relation || "prerequisite",
      courses: (group.requisites || [])
        .map((r) => r.required_course?.[field])
        .filter(Boolean),
    }))
    .filter((group) => group.courses.length > 0);
}

// field: 'course_code' (admin display) or 'course_id' (student planner logic).
async function getCourseRequisites(courseId, { field = "course_code" } = {}) {
  const rule = await RequisiteRule.findOne({
    where: { target_course_id: courseId },
  });
  if (!rule || !rule.enabled) return [];

  const root = await RequisiteGroup.findOne({
    where: { rule_id: rule.rule_id, parent_group_id: null },
  });
  if (!root) return [];

  const orGroups = await RequisiteGroup.findAll({
    where: { parent_group_id: root.group_id },
    order: [["group_id", "ASC"]],
    include: [
      {
        model: Requisite,
        as: "requisites",
        order: [["sort_order", "ASC"]],
        include: [
          {
            model: Course,
            as: "required_course",
            attributes: ["course_code", "course_id"],
          },
        ],
      },
    ],
  });

  return toRelationGroups(orGroups, field);
}

// Returns { [target_course_id]: { prerequisites, corequisites } } for every enabled rule.
async function getAllCourseRequisites({ field = "course_code" } = {}) {
  const rules = await RequisiteRule.findAll({
    where: { enabled: true },
    include: [
      {
        model: RequisiteGroup,
        as: "groups",
        required: false,
        include: [
          {
            model: RequisiteGroup,
            as: "children",
            required: false,
            include: [
              {
                model: Requisite,
                as: "requisites",
                order: [["sort_order", "ASC"]],
                include: [
                  {
                    model: Course,
                    as: "required_course",
                    attributes: ["course_code", "course_id"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  const map = {};
  for (const rule of rules) {
    const root = (rule.groups || []).find((g) => g.operator === "AND");
    if (!root) continue;
    const groups = toRelationGroups(root.children || [], field);
    map[rule.target_course_id] = formatRequisites(groups);
  }
  return map;
}

function groupsToString(groups) {
  const joined = groups.map((g) => g.courses.join(" OR ")).join(" AND ");
  return joined || null;
}

function formatRequisites(requisites) {
  const out = {};
  for (const rel of RELATIONS) {
    out[rel] = groupsToString(requisites.filter((g) => g.relation === rel));
  }
  return out;
}

async function replaceCourseRequisites(courseId, requisites, { adminId } = {}) {
  const clean = normalizeRequisites(requisites);

  const codes = [...new Set(clean.flatMap((g) => g.courses))];
  let codeToId = new Map();
  let missing = [];
  if (codes.length > 0) {
    const found = await Course.findAll({
      where: { course_code: codes },
      attributes: ["course_id", "course_code"],
    });
    codeToId = new Map(found.map((c) => [c.course_code, c.course_id]));
    missing = codes.filter((code) => !codeToId.has(code));
  }
  const course = await Course.findByPk(courseId);
  if (!course)
    return { success: false, message: `Course with ID ${courseId} not found` };
  if (missing.length > 0)
    return { success: false, message: "Invalid course codes", missing };

  const oldFormatted = formatRequisites(await getCourseRequisites(courseId));

  const tx = await sequelize.transaction();
  try {
    const existingRule = await RequisiteRule.findOne({
      where: { target_course_id: courseId },
      transaction: tx,
    });
    if (existingRule) {
      const groups = await RequisiteGroup.findAll({
        where: { rule_id: existingRule.rule_id },
        transaction: tx,
      });
      const groupIds = groups.map((g) => g.group_id);
      if (groupIds.length) {
        await Requisite.destroy({
          where: { group_id: groupIds },
          transaction: tx,
        });
      }
      await RequisiteGroup.destroy({
        where: { rule_id: existingRule.rule_id },
        transaction: tx,
      });
      await existingRule.destroy({ transaction: tx });
    }

    if (clean.length > 0) {
      const rule = await RequisiteRule.create(
        { target_course_id: courseId, enabled: true },
        { transaction: tx },
      );
      const root = await RequisiteGroup.create(
        { rule_id: rule.rule_id, parent_group_id: null, operator: "AND" },
        { transaction: tx },
      );
      for (const group of clean) {
        const orGroup = await RequisiteGroup.create(
          {
            rule_id: rule.rule_id,
            parent_group_id: root.group_id,
            operator: "OR",
          },
          { transaction: tx },
        );
        await Requisite.bulkCreate(
          group.courses.map((code, idx) => ({
            group_id: orGroup.group_id,
            course_id: codeToId.get(code),
            relation: group.relation,
            sort_order: idx,
          })),
          { transaction: tx },
        );
      }
    }

    course.prerequisite = clean.some((g) => g.relation === "prerequisite");
    await course.save({ transaction: tx });
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }

  if (adminId) {
    const newFormatted = formatRequisites(clean);
    for (const rel of RELATIONS) {
      if (oldFormatted[rel] !== newFormatted[rel]) {
        await History.create({
          admin_id: adminId,
          course_id: courseId,
          program_code: null,
          time_stamp: new Date(),
          field_name:
            rel === "prerequisite"
              ? "structured_prerequisites"
              : "structured_corequisites",
          old_value: oldFormatted[rel] || "",
          new_value: newFormatted[rel] || "",
        });
      }
    }
  }

  return { success: true, missing: [] };
}

module.exports = {
  getCourseRequisites,
  getAllCourseRequisites,
  replaceCourseRequisites,
  formatRequisites,
  normalizeRequisites,
};
