import axios from 'axios';
import { tokenManager } from './tokenManager';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Removemos o interceptor de response que causava o redirecionamento direto
// A lógica de logout será gerenciada pelo Redux e React Router
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log do erro para debugging
    if (error.response && error.response.status === 401) {
      console.warn('Token expirado ou inválido. Será tratado pelo useAuth hook.');
    }
    return Promise.reject(error);
  }
);

export default api;
