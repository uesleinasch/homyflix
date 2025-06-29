import api from '../../services/api';
import type { LoginFormData, RegisterFormData } from '../schemas/authSchemas';

export const authService = {
  login: async (credentials: LoginFormData) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterFormData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    // Assuming your API has a logout endpoint
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  },
};
