const { Course, ProgramCourse, ProgramPlan, CourseType, Type, SubType,  CourseAvailability, Availability, credit_points, PreRequisiteGroupAND, PreRequisiteGroupOR } = require('../database');
const { History, Admin } = require('../database');
const fieldNameMap = require('../utils/fieldNameMap');
const Sequelize = require('sequelize');
const { sequelize } = require('../database');





function readable(field) {
  return fieldNameMap[field] || field;
}

async function createHistory({ adminId, courseId, fieldName, oldValue, newValue }) {
  await History.create({
    admin_id: adminId,
    course_id: courseId,
    program_code: null,
    time_stamp: new Date(),
    field_name: fieldName,
    old_value: oldValue !== undefined && oldValue !== null ? String(oldValue) : '',
    new_value: newValue !== undefined && newValue !== null ? String(newValue) : ''
  });
}

// Debug: Log the imported models to verify
console.log('Imported models:', { Course, ProgramCourse, ProgramPlan, CourseType, Type, CourseAvailability, Availability, PreRequisiteGroupAND, PreRequisiteGroupOR });

exports.getCoursesByProgram = async (req, res) => {
  try {
    const { programCode } = req.params;

    // Check if ProgramPlan is defined
    if (!ProgramPlan) {
      throw new Error('ProgramPlan model is not defined');
    }

    // Step 1: Validate that the program_code exists in program_plan
    const program = await ProgramPlan.findOne({ where: { program_code: programCode } });
    if (!program) {
      console.log(`Program ${programCode} not found in program_plan`);
      return res.status(404).json({ success: false, message: `Program ${programCode} not found` });
    }

    // Step 2: Fetch courses for the program via program_course
    const programCourses = await ProgramCourse.findAll({
      where: { program_code: programCode },
      include: [
        {
          model: Course,
          include: [
            {
              model: CourseType,
              include: [
                {
                  model: SubType,
                  include: [
                    { model: Type }
                  ]
                },
              ],
            },
            {
              model: CourseAvailability,
              as: 'courseAvailabilities',
              include: [
                {
                  model: Availability,
                  as: 'availability',
                },
              ],
            },
            {
              model: PreRequisiteGroupAND,
              as: 'pre_requisite_group_ANDs',
            },
            {
              model: PreRequisiteGroupOR,
              as: 'pre_requisite_group_ORs',
            },
          ],
        },
      ],
    });

    // Debug: Log the raw programCourses to inspect the structure
    console.log('Raw programCourses:', JSON.stringify(programCourses, null, 2));

    // Step 3: Format the response
    const formattedCourses = await Promise.all(
      programCourses.map(async (programCourse) => {
        const course = programCourse.course;
        // Extract course type (single type per course)
        const courseTypes = course.course_types
          ?.map(ct => ct.sub_type?.type?.course_type)
          .filter(Boolean) || [];


        // Extract semester availability
        const semesters = course.courseAvailabilities?.map(ca => ca.availability?.semester_name) || [];
        const isSemester1 = semesters.includes('Semester 1');
        const isSemester2 = semesters.includes('Semester 2');
        const isFlexTerm = semesters.includes('Flex Term');

        // Extract prerequisites
        // Extract prerequisites using the same logic as CreateCourseModal summary
        let prerequisites = '-';
        if (course.prerequisite) {
          const andGroups = await PreRequisiteGroupAND.findAll({ where: { course_id: course.course_id } });

          const groupIds = andGroups.map(g => g.group_id);
          const allGroups = await Promise.all(groupIds.map(async groupId => {
            const orCourses = await PreRequisiteGroupOR.findAll({
              where: { group_id: groupId },
              include: [{ model: Course, attributes: ['course_code'], as: 'prereq_course' }]
            });
            return orCourses.map(oc => oc.prereq_course.course_code);
          }));

          prerequisites = allGroups.map(group => group.join(' OR ')).join(' AND ') || '-';
        }


        return {
          'Course Code': course.course_code,
          'Course Title': course.course_title,
          'Course Type': courseTypes,
          'Web Url': course.web_url,
          'Semester 1': isSemester1,
          'Semester 2': isSemester2,
          'Flex Term': isFlexTerm,
          'Pre-requisites': prerequisites,
          'Course Id': course.course_id,
          'Year': course.year || '-',
          'Credit Points': course.course_credit || '',
          'Sub Type': course.course_types?.map(ct => ct.sub_type?.sub_type_name).filter(Boolean) || [],

        };
      })
    );

    res.status(200).json({ success: true, data: formattedCourses });
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { course_code, course_title, web_url, course_type, sub_type, credit_points, year, semester_1, semester_2, flex_term, prerequisites } = req.body;

    // Step 1: Find the course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: `Course with ID ${courseId} not found` });
    }

    const adminId = 1; // <-- Will be replaced later with session user id

    // Step 2: Prepare object to hold actual updates only
    const updates = {};

    // Step 3: Only update + log if value has changed AND is defined in the request
    if (course_code !== undefined && course.course_code !== course_code) {
      await createHistory({ adminId, courseId, fieldName: readable('course_code'), oldValue: course.course_code, newValue: course_code });
      updates.course_code = course_code;
    }

    if (course_title !== undefined && course.course_title !== course_title) {
      await createHistory({ adminId, courseId, fieldName: readable('course_title'), oldValue: course.course_title, newValue: course_title });
      updates.course_title = course_title;
    }

    if (web_url !== undefined && course.web_url !== web_url) {
      await createHistory({ adminId, courseId, fieldName: readable('web_url'), oldValue: course.web_url, newValue: web_url });
      updates.web_url = web_url;
    }

    if (credit_points !== undefined && course.course_credit !== credit_points) {
      await createHistory({
        adminId,
        courseId,
        fieldName: readable('credit_points'),
        oldValue: course.course_credit,
        newValue: credit_points
      });
      updates.course_credit = credit_points;
    }

    if (year !== undefined && course.year !== year) {
      await createHistory({
        adminId,
        courseId,
        fieldName: readable('year'),
        oldValue: course.year,
        newValue: year
      });
      updates.year = year;
    }

    if (Array.isArray(sub_type)) {
      // Clean and deduplicate the incoming sub_type list
      const dedupedSubTypes = [...new Set(sub_type.map(s => s.trim()))];

      const subTypeRecords = await SubType.findAll({
        where: { sub_type_name: dedupedSubTypes }
      });

      const existingCourseTypes = await CourseType.findAll({
        where: { course_id: courseId }
      });

      const existingSubTypeIds = existingCourseTypes.map(e => e.sub_type_id);
      const newSubTypeIds = subTypeRecords.map(st => st.sub_type_id);

      // Add new links (safely prevent duplicates)
      for (const sub of subTypeRecords) {
        const [entry, created] = await CourseType.findOrCreate({
          where: {
            course_id: courseId,
            sub_type_id: sub.sub_type_id
          }
        });

        if (created) {
          await createHistory({
            adminId,
            courseId,
            fieldName: readable('sub_type'),
            oldValue: null,
            newValue: sub.sub_type_name
          });
        }
      }


      // Remove deselected
      for (const existing of existingCourseTypes) {
        if (!newSubTypeIds.includes(existing.sub_type_id)) {
          const st = await SubType.findByPk(existing.sub_type_id);
          await CourseType.destroy({ where: { course_id: courseId, sub_type_id: existing.sub_type_id } });

          await createHistory({
            adminId,
            courseId,
            fieldName: readable('sub_type'),
            oldValue: st?.sub_type_name,
            newValue: null
          });
        }
      }
    }

    // Step 4: Only apply updates if there are any real changes
    if (Object.keys(updates).length > 0) {
      await course.update(updates);
    }

    // Step 5: Update course types (supporting multiple types)
    if (Array.isArray(course_type)) {
      const dedupedTypes = [...new Set(course_type)]; // Remove any accidental frontend duplicates

      // Get existing CourseType entries (with sub_type and type)
      const existingTypes = await CourseType.findAll({
        where: { course_id: courseId },
        include: {
          model: SubType,
          include: Type
        }
      });

      // Get existing SubType IDs and course_type strings
      const existingSubTypeIds = existingTypes.map(ct => ct.sub_type_id);
      const existingTypeNames = [
        ...new Set(existingTypes.map(ct => ct.sub_type?.type?.course_type).filter(Boolean))
      ];

      // Determine which course types to add
      const toAddTypes = dedupedTypes.filter(t => !existingTypeNames.includes(t));
      const toRemoveTypes = existingTypeNames.filter(t => !dedupedTypes.includes(t));

      // Add missing course types
      for (const typeName of toAddTypes) {
        const subTypes = await SubType.findAll({
          include: {
            model: Type,
            where: { course_type: typeName }
          }
        });

        let added = false;
        for (const sub of subTypes) {
          if (!existingSubTypeIds.includes(sub.sub_type_id)) {
            await CourseType.create({
              course_id: courseId,
              sub_type_id: sub.sub_type_id
            });
            added = true;
          }
        }

        if (added) {
          await createHistory({
            adminId,
            courseId,
            fieldName: readable('course_type'),
            oldValue: null,
            newValue: typeName
          });
        }
      }

      // Remove deselected types
      for (const typeName of toRemoveTypes) {
        const subTypes = await SubType.findAll({
          include: {
            model: Type,
            where: { course_type: typeName }
          }
        });

        for (const sub of subTypes) {
          await CourseType.destroy({
            where: {
              course_id: courseId,
              sub_type_id: sub.sub_type_id
            }
          });
        }

        await createHistory({
          adminId,
          courseId,
          fieldName: readable('course_type'),
          oldValue: typeName,
          newValue: null
        });
      }
    }




    // Step 6: Update semester availability
    const semesters = [
      { name: 'Semester 1', value: semester_1, semester_id: 1 },
      { name: 'Semester 2', value: semester_2, semester_id: 2 },
      { name: 'Flex Term', value: flex_term, semester_id: 3 }
    ];

    for (const semester of semesters) {
      if (semester.value !== undefined) {
        const exists = await CourseAvailability.findOne({
          where: { course_id: courseId, semester_id: semester.semester_id }
        });

        const wasAvailable = !!exists;
        const willBeAvailable = !!semester.value;

        if (wasAvailable !== willBeAvailable) {
          await createHistory({
            adminId,
            courseId,
            fieldName: readable(semester.name.toLowerCase().replace(/ /g, '_')), // e.g., "Semester 1" → "semester_1" → "Semester 1 Availability"
            oldValue: wasAvailable ? 'Available' : 'Not Available',
            newValue: willBeAvailable ? 'Available' : 'Not Available'
          });
        }

        if (willBeAvailable && !wasAvailable) {
          await CourseAvailability.create({
            course_id: courseId,
            semester_id: semester.semester_id
          });
        } else if (!willBeAvailable && wasAvailable) {
          await CourseAvailability.destroy({
            where: { course_id: courseId, semester_id: semester.semester_id }
          });
        }
      }
    }
    // Step 7: Update prerequisites
    if (prerequisites && prerequisites !== '-') {
      const prereqCodes = prerequisites.split(' OR ').map(code => code.trim());
      const prereqCourses = await Course.findAll({
        where: { course_code: prereqCodes },
        attributes: ['course_id', 'course_code']
      });

      if (prereqCourses.length !== prereqCodes.length) {
        return res.status(400).json({ success: false, message: 'Invalid prerequisite course codes' });
      }

      // Update prerequisite flag
      course.prerequisite = true;
      await course.save();

      // Clear existing groups
      await PreRequisiteGroupAND.destroy({ where: { course_id: courseId } });
      await PreRequisiteGroupOR.destroy({ where: { course_id: courseId } });

      // Create new group
      const group = await sequelize.models.group.create({});
      const groupId = group.group_id;

      await PreRequisiteGroupAND.create({
        course_id: courseId,
        group_id: groupId
      });

      for (const prereqCourse of prereqCourses) {
        await PreRequisiteGroupOR.create({
          course_id: prereqCourse.course_id,
          group_id: groupId
        });
      }
    } else if (prerequisites === '-') {
      course.prerequisite = false;
      await course.save();
      await PreRequisiteGroupAND.destroy({ where: { course_id: courseId } });
      await PreRequisiteGroupOR.destroy({ where: { course_id: courseId } });
    }

    res.status(200).json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getCourseTypes = async (req, res) => {
  try {
    const types = await Type.findAll({
      attributes: ['course_type'],
      order: [['course_type', 'ASC']]
    });
    console.log('Fetched types:', types);
    if (!types || types.length === 0) {
      console.log('No course types found in the type table');
      return res.status(404).json({ success: false, message: 'No course types found' });
    }
    const courseTypes = types.map(type => type.course_type);
    res.status(200).json({ success: true, data: courseTypes });
  } catch (error) {
    console.error('Error fetching course types:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSubTypes = async (req, res) => {
  try {
    const subTypes = await SubType.findAll({
      attributes: ['sub_type_name'],
      include: {
        model: Type,
        attributes: ['course_type'],
        required: true,
        as: 'type'
      },
      order: [['sub_type_name', 'ASC']]
    });

    const formatted = subTypes.map(st => ({
      label: st.sub_type_name,
      value: st.sub_type_name,
      courseType: st.type?.course_type
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching subtypes:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};






/* exports.createCourse = async (req, res) => {
  try {
    const {
      course_code,
      course_title,
      web_url,
      course_type,
      sub_type,
      year,
      credit_points,
      semester_1,
      semester_2,
      flex_term,
      prerequisites,
      program_code
    } = req.body;

    // Step 1: Generate a new Course ID (e.g., A000001) with proper numeric ordering
    const latest = await Course.findOne({
      where: {
        course_id: {
          [Sequelize.Op.like]: 'A%'
        }
      },
      order: [
        [Sequelize.literal("CAST(SUBSTRING(course_id, 2) AS UNSIGNED)"), 'DESC']
      ]
    });

    const latestId = latest?.course_id?.match(/\d+/)?.[0] || '000000';
    const newId = `A${String(parseInt(latestId, 10) + 1).padStart(6, '0')}`;

    // Step 2: Create Course
    const newCourse = await Course.create({
      course_id: newId,
      course_code,
      course_title,
      web_url: web_url || '',
      course_credit: credit_points,
      year,
      prerequisite: prerequisites && prerequisites !== '-' // mark if any prerequisites exist
    });

    // Step 3: Link to program
    await ProgramCourse.create({
      course_id: newId,
      program_code
    });

    // Step 4: Link CourseType and SubType
    if (Array.isArray(sub_type)) {
      const subTypeRecords = await SubType.findAll({
        where: { sub_type_name: sub_type }
      });

      for (const st of subTypeRecords) {
        await CourseType.create({
          course_id: newId,
          sub_type_id: st.sub_type_id
        });
      }
    } else if (typeof sub_type === 'string') {
      const st = await SubType.findOne({ where: { sub_type_name: sub_type } });
      if (st) {
        await CourseType.create({
          course_id: newId,
          sub_type_id: st.sub_type_id
        });
      }
    }


    // Step 5: Semester Availability
    const semesterMapping = {
      'Semester 1': 1,
      'Semester 2': 2,
      'Flex Term': 3
    };

    if (semester_1) await CourseAvailability.create({ course_id: newId, semester_id: semesterMapping['Semester 1'] });
    if (semester_2) await CourseAvailability.create({ course_id: newId, semester_id: semesterMapping['Semester 2'] });
    if (flex_term) await CourseAvailability.create({ course_id: newId, semester_id: semesterMapping['Flex Term'] });

    // Step 6: Handle prerequisites (if any)
    if (prerequisites && prerequisites !== '-') {
      const codes = prerequisites.split(' OR ').map(code => code.trim());
      const prereqCourses = await Course.findAll({
        where: { course_code: codes },
        attributes: ['course_id']
      });

      const group = await require('../database').sequelize.models.group.create({});
      await PreRequisiteGroupAND.create({ course_id: newId, group_id: group.group_id });
      for (const c of prereqCourses) {
        await PreRequisiteGroupOR.create({ course_id: c.course_id, group_id: group.group_id });
      }
    }

    // Step 7: Log history
    const adminId = 1; // <-- Replace with session-based ID later

    await createHistory({ adminId, courseId: newId, fieldName: 'course_code', oldValue: null, newValue: course_code });
    await createHistory({ adminId, courseId: newId, fieldName: 'course_title', oldValue: null, newValue: course_title });
    await createHistory({ adminId, courseId: newId, fieldName: 'web_url', oldValue: null, newValue: web_url });
    await createHistory({ adminId, courseId: newId, fieldName: 'course_credit', oldValue: null, newValue: credit_points });
    await createHistory({ adminId, courseId: newId, fieldName: 'year', oldValue: null, newValue: year });
    await createHistory({ adminId, courseId: newId, fieldName: 'prerequisite', oldValue: null, newValue: prerequisites && prerequisites !== '-' ? 'true' : 'false' });

    if (course_type) {
      await createHistory({ adminId, courseId: newId, fieldName: 'course_type', oldValue: null, newValue: course_type });
    }

    if (sub_type) {
      const formattedSubType = Array.isArray(sub_type) ? sub_type.join(', ') : sub_type;
      await createHistory({ adminId, courseId: newId, fieldName: 'sub_type', oldValue: null, newValue: formattedSubType });
    }


    if (semester_1) {
      await createHistory({ adminId, courseId: newId, fieldName: 'semester_1', oldValue: null, newValue: 'Available' });
    }
    if (semester_2) {
      await createHistory({ adminId, courseId: newId, fieldName: 'semester_2', oldValue: null, newValue: 'Available' });
    }
    if (flex_term) {
      await createHistory({ adminId, courseId: newId, fieldName: 'flex_term', oldValue: null, newValue: 'Available' });
    }

    if (prerequisites && prerequisites !== '-') {
      await createHistory({ adminId, courseId: newId, fieldName: 'prerequisites', oldValue: null, newValue: prerequisites });
    }

    return res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ success: false, message: 'Failed to create course' });
  }
}; */

 exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const adminId = 1; // replace with real session ID later

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Log current data to History before deletion
    await createHistory({ adminId, courseId, fieldName: 'course_code', oldValue: course.course_code, newValue: null });
    await createHistory({ adminId, courseId, fieldName: 'course_title', oldValue: course.course_title, newValue: null });
    await createHistory({ adminId, courseId, fieldName: 'web_url', oldValue: course.web_url, newValue: null });
    await createHistory({ adminId, courseId, fieldName: 'course_credit', oldValue: course.course_credit, newValue: null });
    await createHistory({ adminId, courseId, fieldName: 'year', oldValue: course.year, newValue: null });

    // Delete associations
    await ProgramCourse.destroy({ where: { course_id: courseId } });
    await CourseType.destroy({ where: { course_id: courseId } });
    await CourseAvailability.destroy({ where: { course_id: courseId } });
        // Handle prerequisite groups cleanup
        const andGroups = await PreRequisiteGroupAND.findAll({
          where: { course_id: courseId }
        });

        const groupIds = andGroups.map(g => g.group_id);

        // Delete AND groups for this course
        await PreRequisiteGroupAND.destroy({ where: { course_id: courseId } });

        for (const groupId of groupIds) {
          // Check if any other AND entry still uses this group
          const stillUsed = await PreRequisiteGroupAND.findOne({
            where: { group_id: groupId }
          });

          if (!stillUsed) {
            // No one else uses this group — delete its OR courses + the group
            await PreRequisiteGroupOR.destroy({ where: { group_id: groupId } });
            await sequelize.models.group.destroy({ where: { group_id: groupId } });
          }
        }


    // Finally, delete the course
    await course.destroy();

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, message: 'Server error during course deletion' });
  }
}; 


exports.createSubType = async (req, res) => {
  try {
    const { sub_type_name, course_type } = req.body;

    console.log('🔍 Received sub_type_name:', sub_type_name);
    console.log('🔍 Received course_type:', course_type);

    if (!sub_type_name || !course_type) {
      return res.status(400).json({ success: false, message: 'Missing sub_type_name or course_type' });
    }

    const type = await Type.findOne({ where: { course_type } });

    if (!type) {
      console.log('❌ Could not find matching course_type in Type table');
      return res.status(400).json({ success: false, message: 'Invalid course type' });
    }

    const existing = await SubType.findOne({ where: { sub_type_name } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Sub Type already exists' });
    }

    const newSubType = await SubType.create({
      sub_type_name,
      course_type_id: type.course_type_id
    });

    return res.status(201).json({ success: true, data: newSubType });
  } catch (error) {
    console.error('❌ Error creating sub type:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getStructuredPrerequisites = async (req, res) => {
  const { courseId } = req.params;

  try {
    const andGroups = await PreRequisiteGroupAND.findAll({
      where: { course_id: courseId }
    });

    const groupIds = andGroups.map(g => g.group_id);

    const allGroups = await Promise.all(groupIds.map(async groupId => {
      const orCourses = await PreRequisiteGroupOR.findAll({
        where: { group_id: groupId },
        include: [{ model: Course, attributes: ['course_code'], as: 'prereq_course' }]
      });

      return orCourses.map(oc => oc.prereq_course.course_code);
    }));

    res.json({ success: true, data: allGroups });
  } catch (err) {
    console.error('Error fetching structured prerequisites:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.updateStructuredPrerequisites = async (req, res) => {
  const { courseId } = req.params;
  const { prerequisites } = req.body;

  console.log('🛠️ Called updateStructuredPrerequisites');
  console.log('courseId param:', courseId);
  console.log('prerequisites body:', prerequisites);

  if (!Array.isArray(prerequisites)) {
    return res.status(400).json({ success: false, message: 'Invalid format' });
  }

  const course = await Course.findByPk(courseId);
  if (!course) {
    return res.status(404).json({ success: false, message: `Course with ID ${courseId} not found` });
  }

  try {
    await PreRequisiteGroupAND.destroy({ where: { course_id: courseId } });

    const Group = sequelize.models.group;

    for (const orGroup of prerequisites) {
      const group = await Group.create({ group_type: 'prerequisite' });
      const groupId = group.group_id;

      await PreRequisiteGroupAND.create({ course_id: courseId, group_id: groupId });

      const prereqCourses = await Course.findAll({
        where: { course_code: orGroup },
        attributes: ['course_id', 'course_code']
      });

      if (prereqCourses.length !== orGroup.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more course codes not found',
          missing: orGroup.filter(code => !prereqCourses.find(c => c.course_code === code))
        });
      }

      for (const prereq of prereqCourses) {
        await PreRequisiteGroupOR.create({ course_id: prereq.course_id, group_id: groupId });
      }
    }

    await course.update({ prerequisite: prerequisites.length > 0 });

    await createHistory({
      adminId: 1,
      courseId,
      fieldName: 'structured_prerequisites',
      oldValue: null,
      newValue: prerequisites.map(group => group.join(' OR ')).join(' AND ')
    });

    res.json({ success: true, message: 'Updated structured prerequisites' });
  } catch (err) {
    console.error('❌ Error updating structured prerequisites:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


exports.getAllCourseCodes = async (req, res) => {
  try {
    const courses = await Course.findAll({ attributes: ['course_code'] });
    const codes = courses.map(course => course.course_code);
    res.json({ success: true, data: codes });
  } catch (err) {
    console.error('Failed to fetch course codes:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch course codes' });
  }
};


exports.createCourse = async (req, res) => {
  try {
    const {
      course_id,
      course_code,
      course_title,
      web_url,
      course_type = [],
      sub_type = [],
      year,
      credit_points,
      availability = {},
      prerequisites,
      program_code
    } = req.body;

    const { semester1, semester2, flexTerm } = availability;

    const adminId = 1; // Replace with session logic later

    // Validate: course_id and course_code must be unique
    const existing = await Course.findByPk(course_id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Course ID already exists' });
    }

    const duplicateCode = await Course.findOne({ where: { course_code } });
    if (duplicateCode) {
      return res.status(400).json({ success: false, message: 'Course Code already exists' });
    }

    // Validate: Sub Types must exist
    if (!Array.isArray(sub_type) || sub_type.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one Sub Type is required' });
    }

    // Get all relevant subtypes that match both name AND selected course_type_id
    const uniqueSubTypeNames = [...new Set(sub_type.map(s => s.trim()))];
    const selectedCourseTypes = [...new Set(course_type.map(t => t.trim()))];

    // Get all relevant subtypes that match both name AND selected course_type_id
    const allSubTypes = await SubType.findAll({
      include: {
        model: Type,
        as: 'type',
        required: true
      }
    });

    // Filter subtypes where both name and course type match selected values
    const subTypeRecords = allSubTypes.filter(st =>
      uniqueSubTypeNames.includes(st.sub_type_name) &&
      selectedCourseTypes.includes(st.type?.course_type)
    );

    if (subTypeRecords.length === 0) {
      return res.status(400).json({ success: false, message: 'No matching Sub Types found for selected Course Types' });
    }




    // Create course
    const newCourse = await Course.create({
      course_id,
      course_code,
      course_title,
      web_url,
      course_credit: credit_points,
      year,
      prerequisite: Array.isArray(prerequisites) && prerequisites.length > 0
    });

    // Link to program
    await ProgramCourse.create({ course_id, program_code });

    // Link sub types
    for (const sub of subTypeRecords) {
      await CourseType.create({
        course_id,
        sub_type_id: sub.sub_type_id
      });
    }

    // Link semester availability
    const semesterMapping = [
      [semester1, 1],
      [semester2, 2],
      [flexTerm, 3]
    ];

    for (const [value, id] of semesterMapping) {
      if (value) {
        await CourseAvailability.create({ course_id, semester_id: id });
      }
    }


    // Link prerequisites (structured format)
    if (Array.isArray(prerequisites) && prerequisites.length > 0) {
      const Group = sequelize.models.group;

      for (const orGroup of prerequisites) {
        const group = await Group.create({ group_type: 'prerequisite' });
        const groupId = group.group_id;

        await PreRequisiteGroupAND.create({ course_id, group_id: groupId });

        const prereqCourses = await Course.findAll({
          where: { course_code: orGroup },
          attributes: ['course_id', 'course_code']
        });

        if (prereqCourses.length !== orGroup.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more prerequisite course codes are invalid',
            missing: orGroup.filter(code => !prereqCourses.find(c => c.course_code === code))
          });
        }

        for (const prereq of prereqCourses) {
          await PreRequisiteGroupOR.create({ course_id: prereq.course_id, group_id: groupId });
        }
      }
    }

    // History logs
    await createHistory({ adminId, courseId: course_id, fieldName: 'course_code', oldValue: null, newValue: course_code });
    await createHistory({ adminId, courseId: course_id, fieldName: 'course_title', oldValue: null, newValue: course_title });
    await createHistory({ adminId, courseId: course_id, fieldName: 'web_url', oldValue: null, newValue: web_url });
    await createHistory({ adminId, courseId: course_id, fieldName: 'course_credit', oldValue: null, newValue: credit_points });
    await createHistory({ adminId, courseId: course_id, fieldName: 'year', oldValue: null, newValue: year });
    await createHistory({ adminId, courseId: course_id, fieldName: 'prerequisite', oldValue: null, newValue: newCourse.prerequisite ? 'true' : 'false' });

    for (const t of course_type) {
      await createHistory({ adminId, courseId: course_id, fieldName: 'course_type', oldValue: null, newValue: t });
    }
    for (const st of sub_type) {
      await createHistory({ adminId, courseId: course_id, fieldName: 'sub_type', oldValue: null, newValue: st });
    }
    if (semester1) await createHistory({ adminId, courseId: course_id, fieldName: 'semester_1', oldValue: null, newValue: 'Available' });
    if (semester2) await createHistory({ adminId, courseId: course_id, fieldName: 'semester_2', oldValue: null, newValue: 'Available' });
    if (flexTerm)  await createHistory({ adminId, courseId: course_id, fieldName: 'flex_term',   oldValue: null, newValue: 'Available' });


    if (Array.isArray(prerequisites) && prerequisites.length > 0) {
      await createHistory({
        adminId,
        courseId: course_id,
        fieldName: 'structured_prerequisites',
        oldValue: null,
        newValue: prerequisites.map(group => group.join(' OR ')).join(' AND ')
      });
    }

    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    console.error('❌ Error creating course:', error);
    res.status(500).json({ success: false, message: 'Server error during course creation' });
  }
};


/*exports.deleteCourse = (req, res) => {
  console.warn("❌ deleteCourse is temporarily disabled.");
  res.status(501).json({ success: false, message: "Course deletion is temporarily disabled." });
};*/
