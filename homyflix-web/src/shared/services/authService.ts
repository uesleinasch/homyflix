// Domain Service Layer - Lógica de domínio de autenticação
import { AxiosError } from 'axios';
import api from '../../core/auth/api';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import type { User } from '../types/user';

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await api.post<User>('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh');
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  private handleAuthError(error: unknown): Error {
    const axiosError = error as AxiosError;
    const message = (axiosError.response?.data as ApiErrorResponse)?.message || 'Erro de autenticação';
    const status = axiosError.response?.status;
    
    // Log do erro para monitoramento
    console.error('Auth Service Error:', {
      message,
      status,
      timestamp: new Date().toISOString()
    });

    return new Error(message);
  }
}

export const authService = AuthService.getInstance();
