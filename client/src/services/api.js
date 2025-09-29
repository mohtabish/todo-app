import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (identifier, password) =>
    api.post('/auth/login', { identifier, password }),
  register: (email, username, password) =>
    api.post('/auth/register', { email, username, password }),
};

export const todoAPI = {
  getTodos: () => api.get('/todos'),
  createTodo: (todo) => api.post('/todos', todo),
  updateTodo: (id, todo) => api.put(`/todos/${id}`, todo),
  deleteTodo: (id) => api.delete(`/todos/${id}`),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getAllTodos: () => api.get('/admin/todos'),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
};

export default api;