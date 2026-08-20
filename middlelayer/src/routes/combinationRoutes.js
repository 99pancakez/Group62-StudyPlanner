const express = require('express');
const router = express.Router();
const CombinationController = require('../controller/CombinationController');

router.get('/', CombinationController.getAllCombinations);

module.exports = router;