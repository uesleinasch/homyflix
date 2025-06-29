// Application Service Layer - Coordena casos de uso de autenticação
import { authService } from './authService';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import type { User } from '../types/user';
import { tokenManager } from '../../core/auth/tokenManager';

export class AuthApplicationService {
  private static instance: AuthApplicationService;

  public static getInstance(): AuthApplicationService {
    if (!AuthApplicationService.instance) {
      AuthApplicationService.instance = new AuthApplicationService();
    }
    return AuthApplicationService.instance;
  }

  async authenticateUser(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const authData = await authService.login(credentials);
      tokenManager.setToken(authData.access_token);
      
      // Tenta extrair informações do usuário do token
      const userFromToken = tokenManager.getUserFromToken();
      if (userFromToken) {
        authData.user = userFromToken;
        tokenManager.setCurrentUser(userFromToken);
      }
      
      this.logAuthEvent('login_success', authData.user?.id);
      
      return authData;
    } catch (error) {
      this.logAuthEvent('login_failed', null, (error as Error).message);
      throw error;
    }
  }

  async registerUser(userData: RegisterData): Promise<AuthResponse> {
    try {
      this.validateRegistrationData(userData);
      
      const registeredUser = await authService.register(userData);
      
      // O register retorna o usuário criado, mas precisamos fazer login para obter o token
      const loginData = await authService.login({
        email: userData.email,
        password: userData.password
      });
      
      tokenManager.setToken(loginData.access_token);
      
      // Usa os dados do usuário retornado do register
      const user = registeredUser as unknown as User;
      loginData.user = user;
      tokenManager.setCurrentUser(user);
      
      this.logAuthEvent('register_success', loginData.user?.id);
      
      return loginData;
    } catch (error) {
      this.logAuthEvent('register_failed', null, (error as Error).message);
      throw error;
    }
  }

  async logoutUser(): Promise<void> {
    try {
      const userId = tokenManager.getCurrentUserId();
      
      await authService.logout();
      tokenManager.clearToken();
      
      this.logAuthEvent('logout_success', userId);
    } catch (error) {
      // Mesmo com erro na API, limpa o token local
      tokenManager.clearToken();
      this.logAuthEvent('logout_failed', null, (error as Error).message);
      throw error;
    }
  }

  async refreshUserToken(): Promise<AuthResponse> {
    try {
      const authData = await authService.refreshToken();
      tokenManager.setToken(authData.access_token);
      
      // Tenta extrair informações do usuário do novo token
      const userFromToken = tokenManager.getUserFromToken();
      if (userFromToken) {
        authData.user = userFromToken;
        tokenManager.setCurrentUser(userFromToken);
      }
      
      this.logAuthEvent('refresh_success');
      
      return authData;
    } catch (error) {
      // Token inválido, limpa dados locais
      tokenManager.clearToken();
      this.logAuthEvent('refresh_failed', null, (error as Error).message);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      // Como não temos a rota /auth/me, retorna o usuário do localStorage
      const user = tokenManager.getCurrentUser();
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      this.logAuthEvent('get_user_failed', null, (error as Error).message);
      throw error;
    }
  }

  private validateRegistrationData(userData: RegisterData): void {
    if (!userData.email || !userData.password) {
      throw new Error('Email e senha são obrigatórios');
    }
    
    if (userData.password.length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres');
    }
    
    // Adicionar mais validações conforme necessário
  }

  private logAuthEvent(event: string, userId?: number | null, error?: string): void {
    const logData = {
      event,
      userId,
      timestamp: new Date().toISOString(),
      ...(error && { error })
    };
    
    console.log('Auth Event:', logData);
    
  // Em produção, enviar para serviço de analytics/logging
  if (typeof window !== 'undefined' && import.meta.env.PROD) {
    // analytics.track(event, logData);
  }
  }
}

export const authApplicationService = AuthApplicationService.getInstance();
