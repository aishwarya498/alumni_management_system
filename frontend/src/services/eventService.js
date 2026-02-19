import apiClient from './alumniService';

export const eventService = {
  getAll: () => apiClient.get('/events/all'),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events/create', data),
  update: (id, data) => apiClient.put(`/events/update/${id}`, data),
  delete: (id) => apiClient.delete(`/events/delete/${id}`)
};
