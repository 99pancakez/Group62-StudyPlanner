const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');
const pdfController = require('../controller/pdfController');

// GET /courses/types - Fetch all course types
router.get('/types', courseController.getCourseTypes);

// GET /courses/subtypes - Fetch all subtypes
router.get('/subtypes', courseController.getSubTypes);

// POST /courses/subtypes - Create a new sub type
router.post('/subtypes', courseController.createSubType);

// POST /courses - Create a new course
router.post('/', courseController.createCourse);

// GET /courses/allCourseCodes - Fetch all course codes (for autocomplete)
router.get('/allCourseCodes', courseController.getAllCourseCodes);

// GET structured prerequisites for a course
router.get('/:courseId/prerequisites/structured', courseController.getStructuredPrerequisites);

// PUT structured prerequisites for a course
router.put('/:courseId/prerequisites/structured', courseController.updateStructuredPrerequisites);

// PUT /courses/:courseId - Update a course
router.put('/:courseId', courseController.updateCourse);

// DELETE /courses/:courseId - Delete a course
router.delete('/:courseId', courseController.deleteCourse);

// GET /courses/:programCode - Fetch courses for a program
router.get('/:programCode', courseController.getCoursesByProgram);

// GET /courses/download-courses/:programCode - download courses PDF for a program
router.get('/download-courses/:programCode', pdfController.downloadCoursesPDF);

module.exports = router;
