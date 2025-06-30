import api from '../../core/auth/api';
import type { User } from '../types/user';

export interface UpdatePasswordData {
  password: string;
  password_confirmation: string;
}

export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

class UserService {
  async updateProfile(data: UpdateUserProfileData): Promise<User> {
    const response = await api.patch<User>('/user/profile', data);
    return response.data;
  }

  async updatePassword(data: UpdatePasswordData): Promise<User> {
    const response = await api.patch<User>('/user/profile', data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/user/profile');
    return response.data;
  }
}

export const userService = new UserService(); 