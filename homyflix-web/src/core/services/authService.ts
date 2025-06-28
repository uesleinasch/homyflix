import type { LoginCredentials, AuthResponse, RegisterData } from "../../types/auth";
import api from "../auth/api";

const setSession = (accessToken: string | null, refreshToken?: string | null) => {
  if (accessToken && refreshToken) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { access_token, refresh_token } = response.data;
    setSession(access_token, refresh_token);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { access_token, refresh_token } = response.data;
    setSession(access_token, refresh_token);
    return response.data;
  }

  logout() {
    setSession(null);
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await api.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;
      setSession(access_token, newRefreshToken);
      return access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.logout();
      return null;
    }
  }
}

const authService = new AuthService();

export default authService;
