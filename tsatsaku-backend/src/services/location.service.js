// Location data for Country/State/City
// Using embedded data for reliability (can be replaced with API call)

const countries = [
  { id: 'NG', name: 'Nigeria', code: 'NGN' },
  { id: 'US', name: 'United States', code: 'USD' },
  { id: 'GB', name: 'United Kingdom', code: 'GBP' },
  { id: 'CA', name: 'Canada', code: 'CAD' },
  { id: 'AU', name: 'Australia', code: 'AUD' },
  { id: 'DE', name: 'Germany', code: 'EUR' },
  { id: 'FR', name: 'France', code: 'EUR' },
  { id: 'IN', name: 'India', code: 'INR' },
  { id: 'CN', name: 'China', code: 'CNY' },
  { id: 'JP', name: 'Japan', code: 'JPY' },
  { id: 'ZA', name: 'South Africa', code: 'ZAR' },
  { id: 'GH', name: 'Ghana', code: 'GHS' },
  { id: 'KE', name: 'Kenya', code: 'KES' }
];

const states = {
  'NG': [
    { id: 'NG-AB', name: 'Abia', countryId: 'NG' },
    { id: 'NG-AD', name: 'Adamawa', countryId: 'NG' },
    { id: 'NG-AK', name: 'Akwa Ibom', countryId: 'NG' },
    { id: 'NG-AN', name: 'Anambra', countryId: 'NG' },
    { id: 'NG-BA', name: 'Bauchi', countryId: 'NG' },
    { id: 'NG-BY', name: 'Bayelsa', countryId: 'NG' },
    { id: 'NG-BE', name: 'Benue', countryId: 'NG' },
    { id: 'NG-BO', name: 'Borno', countryId: 'NG' },
    { id: 'NG-CR', name: 'Cross River', countryId: 'NG' },
    { id: 'NG-DE', name: 'Delta', countryId: 'NG' },
    { id: 'NG-EB', name: 'Ebonyi', countryId: 'NG' },
    { id: 'NG-ED', name: 'Edo', countryId: 'NG' },
    { id: 'NG-EK', name: 'Ekiti', countryId: 'NG' },
    { id: 'NG-EN', name: 'Enugu', countryId: 'NG' },
    { id: 'NG-FC', name: 'FCT - Abuja', countryId: 'NG' },
    { id: 'NG-GO', name: 'Gombe', countryId: 'NG' },
    { id: 'NG-IM', name: 'Imo', countryId: 'NG' },
    { id: 'NG-JI', name: 'Jigawa', countryId: 'NG' },
    { id: 'NG-KD', name: 'Kaduna', countryId: 'NG' },
    { id: 'NG-KN', name: 'Kano', countryId: 'NG' },
    { id: 'NG-KT', name: 'Katsina', countryId: 'NG' },
    { id: 'NG-KE', name: 'Kebbi', countryId: 'NG' },
    { id: 'NG-KO', name: 'Kogi', countryId: 'NG' },
    { id: 'NG-KW', name: 'Kwara', countryId: 'NG' },
    { id: 'NG-LA', name: 'Lagos', countryId: 'NG' },
    { id: 'NG-NA', name: 'Nasarawa', countryId: 'NG' },
    { id: 'NG-NI', name: 'Niger', countryId: 'NG' },
    { id: 'NG-OG', name: 'Ogun', countryId: 'NG' },
    { id: 'NG-ON', name: 'Ondo', countryId: 'NG' },
    { id: 'NG-OS', name: 'Osun', countryId: 'NG' },
    { id: 'NG-OY', name: 'Oyo', countryId: 'NG' },
    { id: 'NG-PL', name: 'Plateau', countryId: 'NG' },
    { id: 'NG-RI', name: 'Rivers', countryId: 'NG' },
    { id: 'NG-SO', name: 'Sokoto', countryId: 'NG' },
    { id: 'NG-TA', name: 'Taraba', countryId: 'NG' },
    { id: 'NG-YO', name: 'Yobe', countryId: 'NG' },
    { id: 'NG-ZA', name: 'Zamfara', countryId: 'NG' }
  ],
  'US': [
    { id: 'US-CA', name: 'California', countryId: 'US' },
    { id: 'US-NY', name: 'New York', countryId: 'US' },
    { id: 'US-TX', name: 'Texas', countryId: 'US' },
    { id: 'US-FL', name: 'Florida', countryId: 'US' },
    { id: 'US-IL', name: 'Illinois', countryId: 'US' },
    { id: 'US-PA', name: 'Pennsylvania', countryId: 'US' },
    { id: 'US-OH', name: 'Ohio', countryId: 'US' },
    { id: 'US-GA', name: 'Georgia', countryId: 'US' },
    { id: 'US-NC', name: 'North Carolina', countryId: 'US' },
    { id: 'US-MI', name: 'Michigan', countryId: 'US' }
  ],
  'GB': [
    { id: 'GB-ENG', name: 'England', countryId: 'GB' },
    { id: 'GB-SCT', name: 'Scotland', countryId: 'GB' },
    { id: 'GB-WLS', name: 'Wales', countryId: 'GB' },
    { id: 'GB-NIR', name: 'Northern Ireland', countryId: 'GB' }
  ],
  'IN': [
    { id: 'IN-MH', name: 'Maharashtra', countryId: 'IN' },
    { id: 'IN-KA', name: 'Karnataka', countryId: 'IN' },
    { id: 'IN-TN', name: 'Tamil Nadu', countryId: 'IN' },
    { id: 'IN-DL', name: 'Delhi', countryId: 'IN' },
    { id: 'IN-UP', name: 'Uttar Pradesh', countryId: 'IN' },
    { id: 'IN-GJ', name: 'Gujarat', countryId: 'IN' },
    { id: 'IN-WB', name: 'West Bengal', countryId: 'IN' },
    { id: 'IN-RJ', name: 'Rajasthan', countryId: 'IN' },
    { id: 'IN-KL', name: 'Kerala', countryId: 'IN' },
    { id: 'IN-AP', name: 'Andhra Pradesh', countryId: 'IN' }
  ]
};

const cities = {
  'NG-LA': [
    { id: 'NG-LA-IKJ', name: 'Ikeja', stateId: 'NG-LA' },
    { id: 'NG-LA-VI', name: 'Victoria Island', stateId: 'NG-LA' },
    { id: 'NG-LA-LI', name: 'Lekki', stateId: 'NG-LA' },
    { id: 'NG-LA-YAB', name: 'Yaba', stateId: 'NG-LA' },
    { id: 'NG-LA-SUR', name: 'Surulere', stateId: 'NG-LA' },
    { id: 'NG-LA-APL', name: 'Apapa', stateId: 'NG-LA' },
    { id: 'NG-LA-MUS', name: 'Mushin', stateId: 'NG-LA' },
    { id: 'NG-LA-OJO', name: 'Ojo', stateId: 'NG-LA' },
    { id: 'NG-LA-AGE', name: 'Agege', stateId: 'NG-LA' },
    { id: 'NG-LA-IKO', name: 'Ikorodu', stateId: 'NG-LA' }
  ],
  'NG-FC': [
    { id: 'NG-FC-GAR', name: 'Garki', stateId: 'NG-FC' },
    { id: 'NG-FC-WAI', name: 'Wuse', stateId: 'NG-FC' },
    { id: 'NG-FC-MAI', name: 'Maitama', stateId: 'NG-FC' },
    { id: 'NG-FC-ASO', name: 'Asokoro', stateId: 'NG-FC' },
    { id: 'NG-FC-GUZ', name: 'Guzape', stateId: 'NG-FC' },
    { id: 'NG-FC-JBI', name: 'Jabi', stateId: 'NG-FC' },
    { id: 'NG-FC-UTC', name: 'Utako', stateId: 'NG-FC' }
  ],
  'NG-RI': [
    { id: 'NG-RI-PHC', name: 'Port Harcourt', stateId: 'NG-RI' },
    { id: 'NG-RI-OBI', name: 'Obio-Akpor', stateId: 'NG-RI' },
    { id: 'NG-RI-BON', name: 'Bonny', stateId: 'NG-RI' },
    { id: 'NG-RI-ELE', name: 'Eleme', stateId: 'NG-RI' }
  ],
  'NG-KN': [
    { id: 'NG-KN-KAN', name: 'Kano Municipal', stateId: 'NG-KN' },
    { id: 'NG-KN-NAS', name: 'Nassarawa', stateId: 'NG-KN' },
    { id: 'NG-KN-GWA', name: 'Gwale', stateId: 'NG-KN' },
    { id: 'NG-KN-DAL', name: 'Dala', stateId: 'NG-KN' }
  ],
  'US-CA': [
    { id: 'US-CA-LA', name: 'Los Angeles', stateId: 'US-CA' },
    { id: 'US-CA-SF', name: 'San Francisco', stateId: 'US-CA' },
    { id: 'US-CA-SD', name: 'San Diego', stateId: 'US-CA' },
    { id: 'US-CA-SJ', name: 'San Jose', stateId: 'US-CA' },
    { id: 'US-CA-SAC', name: 'Sacramento', stateId: 'US-CA' }
  ],
  'US-NY': [
    { id: 'US-NY-NYC', name: 'New York City', stateId: 'US-NY' },
    { id: 'US-NY-BUF', name: 'Buffalo', stateId: 'US-NY' },
    { id: 'US-NY-ROC', name: 'Rochester', stateId: 'US-NY' },
    { id: 'US-NY-ALB', name: 'Albany', stateId: 'US-NY' }
  ],
  'GB-ENG': [
    { id: 'GB-ENG-LON', name: 'London', stateId: 'GB-ENG' },
    { id: 'GB-ENG-MAN', name: 'Manchester', stateId: 'GB-ENG' },
    { id: 'GB-ENG-BIR', name: 'Birmingham', stateId: 'GB-ENG' },
    { id: 'GB-ENG-LEE', name: 'Leeds', stateId: 'GB-ENG' },
    { id: 'GB-ENG-LIV', name: 'Liverpool', stateId: 'GB-ENG' }
  ],
  'IN-MH': [
    { id: 'IN-MH-MUM', name: 'Mumbai', stateId: 'IN-MH' },
    { id: 'IN-MH-PUN', name: 'Pune', stateId: 'IN-MH' },
    { id: 'IN-MH-NAG', name: 'Nagpur', stateId: 'IN-MH' },
    { id: 'IN-MH-NAS', name: 'Nashik', stateId: 'IN-MH' }
  ]
};

// Get all countries
const getCountries = () => {
  return countries;
};

// Get states by country
const getStatesByCountry = (countryId) => {
  return states[countryId] || [];
};

// Get cities by state
const getCitiesByState = (stateId) => {
  return cities[stateId] || [];
};

module.exports = {
  getCountries,
  getStatesByCountry,
  getCitiesByState
};
