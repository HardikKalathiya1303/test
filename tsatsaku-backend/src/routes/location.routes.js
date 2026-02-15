const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

// Routes (Public)
router.get('/countries', locationController.getCountries);
router.get('/states/:countryId', locationController.getStates);
router.get('/cities/:stateId', locationController.getCities);

module.exports = router;
