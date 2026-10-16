const fs = require("fs");
const path = require("path");
const db = require("../index");

const seed_order = [
    {model: "Admin", file: "admin.json"},
    {model: "Availability", file: "availability.json", upsert: true},
    {model: "Type", file: "type.json"},
    {model: "SubType", file: "sub_type.json"},
    {model: "ProgramPlan", file: "program_plan.json"},
    {model: "Course", file: "course.json"},
    {model: "Combination", file: "combination.json"},
    {model: "CombinationGroup", file: "combination_group.json"},
    {model: "CombinationGroupMapping", file: "combination_group_mapping.json"},
    {model: "ComboGroupTypeMapping", file: "combo_group_type_mapping.json"},
    {model: "CourseAvailability", file: "course_availability.json"},
    {model: "CourseType", file: "course_type.json"},
    {model: "ProgramCourse", file: "program_course.json"},
    {model: "RequisiteRule", file: "requisite_rule.json"},
    {model: "RequisiteGroup", file: "requisite_group.json"},
    {model: "Requisite", file: "requisite.json"},
    {model: "History", file: "history.json"},
];


const getModel = (name) => {
    const m = db[name] || db.sequelize.models[name];
    if (!m) {
        throw new Error(`No model "${name}". db keys: ${Object.keys(db).join(", ")}`);
    }
    return m;
};

// Put parent rows before the rows that reference them
const sortByParent = (rows, idKey, parentKey) => {
    const byId = new Map(rows.map((r) => [String(r[idKey]), r]));
    const out = [];
    const done = new Set();
    const visiting = new Set();

    const visit = (r) => {
        const id = String(r[idKey]);
        if (done.has(id)) return;
        if (visiting.has(id)) throw new Error(`Circular parent reference at ${idKey}=${id}`);
        visiting.add(id);
        const parent = r[parentKey];
        if (parent != null && byId.has(String(parent))) visit(byId.get(String(parent)));
        visiting.delete(id);
        done.add(id);
        out.push(r);
    };

    rows.forEach(visit);
    return out;
};

const seedData = async () => {
    await db.sequelize.transaction(async (t) => {
        for (const {model, file} of seed_order) {
            const Model = getModel(model);
            const filePath = path.join(__dirname, "data", file);
            let rows = JSON.parse(fs.readFileSync(filePath, "utf8"));

            if (model === "RequisiteGroup") {
                rows = sortByParent(rows, "group_id", "parent_group_id");
            }

            try {
                await Model.bulkCreate(rows, {
                    validate: true,
                    transaction: t,
                });

                const total = await Model.count({ transaction: t });
                console.log(
                    `Seeded ${model}: json=${rows.length}, table=${total}` +
                    (total !== rows.length ? "  <-- MISMATCH" : "")
                );
            } catch (err) {
                console.error(`[${model}] bulkCreate failed:`, err.message);
                if (err.errors) {
                    err.errors.forEach((e) => console.error(`  - ${e.path}: ${e.message} (value: ${e.value})`));
                }
                throw err; // keep the rollback behavior
            }
        }
    });
};

module.exports = { seedData, seed_order, getModel };