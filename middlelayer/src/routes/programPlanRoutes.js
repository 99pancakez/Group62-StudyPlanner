const express = require('express');
const router = express.Router();
const programPlanController = require('../controller/programPlanController');

router.get('/available-courses', programPlanController.getAvailableCourses);
router.get('/all-courses-with-prerequisites', programPlanController.getAllCoursesWithPrerequisites);

module.exports = router;