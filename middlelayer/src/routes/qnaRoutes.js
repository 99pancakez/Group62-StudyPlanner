const express = require('express');
const router = express.Router();
const qnaController = require('../controller/qnaController');

router.get('/courses', qnaController.getCourses);

module.exports = router;