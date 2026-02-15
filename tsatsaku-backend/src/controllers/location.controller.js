const { successResponse, errorResponse } = require('../utils/response.utils');
const locationService = require('../services/location.service');

// @desc    Get all countries
// @route   GET /api/locations/countries
// @access  Public
exports.getCountries = async (req, res) => {
  try {
    const countries = locationService.getCountries();
    return successResponse(res, countries, 'Countries fetched successfully');
  } catch (error) {
    console.error('Get countries error:', error);
    return errorResponse(res, error.message || 'Failed to fetch countries', 500);
  }
};

// @desc    Get states by country
// @route   GET /api/locations/states/:countryId
// @access  Public
exports.getStates = async (req, res) => {
  try {
    const { countryId } = req.params;
    const states = locationService.getStatesByCountry(countryId);
    return successResponse(res, states, 'States fetched successfully');
  } catch (error) {
    console.error('Get states error:', error);
    return errorResponse(res, error.message || 'Failed to fetch states', 500);
  }
};

// @desc    Get cities by state
// @route   GET /api/locations/cities/:stateId
// @access  Public
exports.getCities = async (req, res) => {
  try {
    const { stateId } = req.params;
    const cities = locationService.getCitiesByState(stateId);
    return successResponse(res, cities, 'Cities fetched successfully');
  } catch (error) {
    console.error('Get cities error:', error);
    return errorResponse(res, error.message || 'Failed to fetch cities', 500);
  }
};
