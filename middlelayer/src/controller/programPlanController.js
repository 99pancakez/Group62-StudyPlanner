const {
  Course,
  Availability,
  CourseType,
  RequisiteRule,
  CourseAvailability,
} = require("../database");
const { formatRequisites, getCourseRequisites } = require("./requisiteService");

const getAvailableCourses = async (req, res) => {
  try {
    const allCourses = await Course.findAll({
      include: [
        {
          model: CourseAvailability,
          as: "courseAvailabilities",
          include: [
            {
              model: Availability,
              as: "availability",
              attributes: ["semester_id", "semester_name"],
            },
          ],
        },
        {
          model: CourseType,
          as: "course_types",
          attributes: ["sub_type_id"],
        },
      ],
    });

    const response = allCourses
      .filter((course) => course.course_types && course.course_types.length > 0)
      .map((course) => ({
        course_id: course.course_id,
        course_code: course.course_code,
        course_title: course.course_title,
        course_credit: course.course_credit,
        sub_type_ids: course.course_types.map((ct) => ct.sub_type_id),
        year: course.year,
        semesters: course.courseAvailabilities.map((ca) => ({
          semester_id: ca.availability.semester_id,
          ...(ca.availability.semester_name && {
            semester_name: ca.availability.semester_name,
          }),
        })),
      }));

    res.json(response);
  } catch (error) {
    console.error("Error fetching available courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

const getAllCoursesWithPrerequisites = async (req, res) => {
  try {
    const rules = await RequisiteRule.findAll({
      where: { enabled: true },
      attributes: ["target_course_id"],
    });
    const courseIds = rules.map((r) => r.target_course_id);

    const courses = courseIds.length
      ? await Course.findAll({
          where: { course_id: courseIds },
          attributes: ["course_id", "course_title"],
        })
      : [];
    const titleById = new Map(
      courses.map((c) => [c.course_id, c.course_title]),
    );

    const response = [];
    for (const courseId of courseIds) {
      response.push({
        course_id: courseId,
        course_title: titleById.get(courseId),
        ...formatRequisites(
          await getCourseRequisites(courseId, { field: "course_id" }),
        ),
      });
    }
    res.json(response);
  } catch (error) {
    console.error("Error fetching all courses with requisites:", error);
    res.status(500).json({ error: "Failed to fetch courses with requisites" });
  }
};

module.exports = { getAvailableCourses, getAllCoursesWithPrerequisites };
