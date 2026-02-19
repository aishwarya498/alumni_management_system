import apiClient from './alumniService';

export const storyService = {
  getAll: () => apiClient.get('/stories/all'),
  getById: (id) => apiClient.get(`/stories/${id}`),
  create: (data) => apiClient.post('/stories/create', data),
  update: (id, data) => apiClient.put(`/stories/update/${id}`, data),
  delete: (id) => apiClient.delete(`/stories/delete/${id}`)
};
