import type { User } from '../../types/user';

// Token Manager - Gerencia tokens de autenticação de forma segura
export class TokenManager {
  private static instance: TokenManager;
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'currentUser';

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
      throw new Error('Não foi possível salvar o token de autenticação');
    }
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  }

  clearToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Erro ao limpar token:', error);
    }
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decodifica o JWT para verificar expiração
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token inválido:', error);
      return false;
    }
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.user_id || null;
    } catch (error) {
      console.error('Erro ao extrair ID do usuário:', error);
      return null;
    }
  }

  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // O JWT do Laravel geralmente inclui o ID do usuário no 'sub'
      // Como não temos todos os dados, retornamos um objeto parcial
      if (payload.sub) {
        return {
          id: payload.sub,
          name: payload.name || 'Usuário',
          email: payload.email || ''
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao extrair usuário do token:', error);
      return null;
    }
  }

  setCurrentUser(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  }

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  }
}

export const tokenManager = TokenManager.getInstance();
