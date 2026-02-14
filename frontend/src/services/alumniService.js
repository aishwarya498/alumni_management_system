import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Alumni API calls
export const alumniService = {
  // Create new alumni
  createAlumni: (data) => apiClient.post('/alumni/create', data),

  // Get all alumni
  getAllAlumni: () => apiClient.get('/alumni/all'),

  // Get alumni by ID
  getAlumniById: (id) => apiClient.get(`/alumni/${id}`),

  // Search alumni
  searchAlumni: (searchTerm) => apiClient.get('/alumni/search', { params: { searchTerm } }),

  // Update alumni
  updateAlumni: (id, data) => apiClient.put(`/alumni/update/${id}`, data),

  // Delete alumni
  deleteAlumni: (id) => apiClient.delete(`/alumni/delete/${id}`),

  // Get statistics
  getStatistics: () => apiClient.get('/alumni/statistics')
};

export default apiClient;
