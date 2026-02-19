import apiClient from './alumniService';

export const jobService = {
  getAll: () => apiClient.get('/jobs/all'),
  getById: (id) => apiClient.get(`/jobs/${id}`),
  create: (data) => apiClient.post('/jobs/create', data),
  update: (id, data) => apiClient.put(`/jobs/update/${id}`, data),
  delete: (id) => apiClient.delete(`/jobs/delete/${id}`)
};
