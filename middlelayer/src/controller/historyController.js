const db = require('../database');
const Course = db.Course;
const History = db.History;

// Reusable function to log history entries
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

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        await createHistory({
          adminId: 1,
          courseId: newCourse.course_id,
          fieldName: key,
          oldValue: null,
          newValue: req.body[key]
        });
      }
    }
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const existingCourse = await Course.findByPk(courseId);

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    for (const key in req.body) {
      if (req.body.hasOwnProperty(key) && existingCourse[key] !== req.body[key]) {
        await createHistory({
          adminId: 1,
          courseId,
          fieldName: key,
          oldValue: existingCourse[key],
          newValue: req.body[key]
        });
      }
    }

    await existingCourse.update(req.body);
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const existingCourse = await Course.findByPk(courseId);

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const courseData = existingCourse.toJSON();
    for (const key in courseData) {
      if (courseData.hasOwnProperty(key)) {
        await createHistory({
          adminId: 1,
          courseId,
          fieldName: key,
          oldValue: courseData[key],
          newValue: null
        });
      }
    }

    await existingCourse.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
};

exports.getHistoryLogs = async (req, res) => {
  try {
    const logs = await History.findAll({
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['course_title']
        }
      ],
      order: [['time_stamp', 'DESC']]
    });

    const formattedLogs = logs.map(log => {
      console.log('Joined Course:', log.course);
      return {
        time_stamp: log.time_stamp,
        admin_id: log.admin_id,
        course: log.course?.course_title || `Course ID ${log.course_id}`,
        field_name: log.field_name,
        old_value: log.old_value,
        new_value: log.new_value
      };
    });

    res.json(formattedLogs);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Error fetching history' });
  }

  
};

