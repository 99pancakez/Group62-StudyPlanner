const { Course, Availability, PreRequisiteGroupAND, PreRequisiteGroupOR, CourseType, CourseAvailability } = require('../database');

const getAvailableCourses = async (req, res) => {
  try {
    const allCourses = await Course.findAll({
      include: [
        {
          model: CourseAvailability,
          as: 'courseAvailabilities',
          include: [
            {
              model: Availability,
              as: 'availability',
              attributes: ['semester_id', 'semester_name']
            }
          ]
        },
        {
          model: CourseType,
          as: 'course_types',
          attributes: ['sub_type_id']
        }
      ]
    });

    const response = allCourses
      .filter(course => course.course_types && course.course_types.length > 0)
      .map(course => ({
        course_id: course.course_id,
        course_title: course.course_title,
        course_credit: course.course_credit,
        sub_type_ids: course.course_types.map(ct => ct.sub_type_id),
        year: course.year,
        semesters: course.courseAvailabilities.map(ca => ({
          semester_id: ca.availability.semester_id,
          ...(ca.availability.semester_name && { semester_name: ca.availability.semester_name })
        }))
      }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

const getAllCoursesWithPrerequisites = async (req, res) => {
  try {
    // Fetch all courses where prerequisite = true with their PreRequisiteGroupAND
    const courses = await Course.findAll({
      where: { prerequisite: true },
      include: [
        {
          model: PreRequisiteGroupAND,
          as: 'pre_requisite_group_ANDs',
          attributes: ['group_id', 'course_id'] // Include only necessary fields
        }
      ]
    });

    // Process each course to fetch its prerequisites
    const response = await Promise.all(courses.map(async (course) => {
      const andGroups = course.pre_requisite_group_ANDs || [];
      if (andGroups.length === 0) {
        return {
          course_id: course.course_id,
          course_title: course.course_title,
          prerequisites: null
        };
      }

      // Fetch PreRequisiteGroupOR for each group_id
      const groupIds = andGroups.map(group => group.group_id);
      const orEntries = await PreRequisiteGroupOR.findAll({
        where: { group_id: groupIds },
        attributes: ['group_id', 'course_id']
      });

      // Group OR entries by group_id
      const orGroups = {};
      orEntries.forEach(entry => {
        if (!orGroups[entry.group_id]) orGroups[entry.group_id] = [];
        orGroups[entry.group_id].push(entry.course_id);
      });

      // Format prerequisites
      const prerequisiteStrings = andGroups.map(group => {
        const orCourses = orGroups[group.group_id] || [];
        return orCourses.join(' OR ');
      }).filter(str => str.length > 0); // Filter out empty groups

      const prerequisites = prerequisiteStrings.join(' AND ');

      return {
        course_id: course.course_id,
        course_title: course.course_title,
        prerequisites: prerequisites || null
      };
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching all courses with prerequisites:', error);
    res.status(500).json({ error: 'Failed to fetch courses with prerequisites' });
  }
};



module.exports = { getAvailableCourses, getAllCoursesWithPrerequisites};