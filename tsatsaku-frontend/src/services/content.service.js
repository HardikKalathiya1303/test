import api from '@/lib/api';

// Get content page by type
export const getContent = async (pageType) => {
  const response = await api.get(`/content/${pageType}`);
  return response.data;
};

// Submit contact form
export const submitContact = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

// Alias for submitContact
export const submitContactForm = submitContact;
