import apiClient from './alumniService';

export const donationService = {
  getAll: () => apiClient.get('/donations/all'),
  getById: (id) => apiClient.get(`/donations/${id}`),
  create: (data) => apiClient.post('/donations/create', data),
  update: (id, data) => apiClient.put(`/donations/update/${id}`, data),
  delete: (id) => apiClient.delete(`/donations/delete/${id}`)
};
