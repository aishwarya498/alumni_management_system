import apiClient from './alumniService';

export const networkingService = {
  getAll: () => apiClient.get('/networking/all'),
  getById: (id) => apiClient.get(`/networking/${id}`),
  create: (data) => apiClient.post('/networking/create', data),
  update: (id, data) => apiClient.put(`/networking/update/${id}`, data),
  delete: (id) => apiClient.delete(`/networking/delete/${id}`)
};
