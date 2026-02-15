const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');

// Routes (Public)
router.get('/:pageType', contentController.getContentByType);

module.exports = router;
