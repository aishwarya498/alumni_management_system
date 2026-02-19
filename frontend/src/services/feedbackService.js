import apiClient from './alumniService';

export const feedbackService = {
  getAll: () => apiClient.get('/feedback/all'),
  getById: (id) => apiClient.get(`/feedback/${id}`),
  create: (data) => apiClient.post('/feedback/create', data),
  update: (id, data) => apiClient.put(`/feedback/update/${id}`, data),
  delete: (id) => apiClient.delete(`/feedback/delete/${id}`)
};
