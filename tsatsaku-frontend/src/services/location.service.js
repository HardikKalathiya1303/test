import api from '@/lib/api';

// Get all countries
export const getCountries = async () => {
  const response = await api.get('/locations/countries');
  return response.data;
};

// Get states by country
export const getStates = async (countryId) => {
  const response = await api.get(`/locations/states/${countryId}`);
  return response.data;
};

// Get cities by state
export const getCities = async (stateId) => {
  const response = await api.get(`/locations/cities/${stateId}`);
  return response.data;
};
