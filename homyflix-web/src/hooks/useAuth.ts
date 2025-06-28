/**
 * Hook customizado para gerenciamento de autenticação
 * 
 * Features implementadas:
 * - Validação automática de token JWT
 * - Refresh automático quando token está próximo da expiração (5 min)
 * - Verificação periódica do estado de autenticação (a cada minuto)
 * - Sincronização quando a janela/aba ganha foco
 * - Logout automático quando token expira
 * - Métodos para login, registro, logout e refresh manual
 * - Estado compartilhado via Redux
 * 
 * @returns {Object} Objeto contendo estado e métodos de autenticação
 */
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, refreshToken, syncAuthState, clearAuthState } from '../store/slices/authSlice';
import type { LoginCredentials, RegisterData } from '../types/auth';
import type { AppDispatch, RootState } from '../store/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  /**
   * Valida se o token JWT ainda é válido
   */
  const isTokenValid = useCallback((): boolean => {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }, [token]);

  /**
   * Verifica se o token está próximo da expiração (5 minutos)
   */
  const isTokenExpiringSoon = useCallback((): boolean => {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;
      return timeUntilExpiry < 300; // 5 minutos
    } catch {
      return false;
    }
  }, [token]);

  /**
   * Realiza o refresh do token
   */
  const handleTokenRefresh = useCallback(async () => {
    if (!token || !isTokenValid()) {
      dispatch(clearAuthState());
      navigate('/login', { replace: true });
      return { success: false, error: 'Token inválido' };
    }

    try {
      const result = await dispatch(refreshToken()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      dispatch(clearAuthState());
      navigate('/login', { replace: true });
      return { success: false, error: error as string };
    }
  }, [token, isTokenValid, dispatch, navigate]);

  const authenticateUser = useCallback(async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      navigate('/dashboard');
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch, navigate]);

  const registerUser = useCallback(async (userData: RegisterData) => {
    try {
      const result = await dispatch(register(userData)).unwrap();
      navigate('/dashboard');
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch, navigate]);

  const logoutUser = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Remove estado local mesmo se a API falhar
      dispatch(clearAuthState());
    } finally {
      navigate('/login', { replace: true });
    }
    return { success: true };
  }, [dispatch, navigate]);

  const refreshUserToken = useCallback(async () => {
    return await handleTokenRefresh();
  }, [handleTokenRefresh]);

  const syncAuth = useCallback(() => {
    dispatch(syncAuthState());
  }, [dispatch]);

  const clearAuth = useCallback(() => {
    dispatch(clearAuthState());
    navigate('/login');
  }, [dispatch, navigate]);

  /**
   * Verifica o estado da autenticação na inicialização
   */
  useEffect(() => {
    const checkAuthState = async () => {
      // Sincroniza o estado com localStorage na inicialização
      dispatch(syncAuthState());
      
      if (token && !isTokenValid()) {
        console.log('Token inválido detectado na inicialização');
        await handleTokenRefresh();
      } else if (token && isTokenExpiringSoon()) {
        console.log('Token próximo da expiração detectado na inicialização');
        await handleTokenRefresh();
      }
    };

    checkAuthState();
  }, []); // Removemos dependencies para evitar loops

  /**
   * Configura verificação periódica do token
   */
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Verifica a cada minuto se o token está próximo da expiração
    const interval = setInterval(() => {
      if (!isTokenValid()) {
        handleTokenRefresh();
      } else if (isTokenExpiringSoon()) {
        handleTokenRefresh();
      }
    }, 60 * 1000); // Verifica a cada minuto

    return () => clearInterval(interval);
  }, [isAuthenticated, token, isTokenValid, isTokenExpiringSoon, handleTokenRefresh]);

  /**
   * Sincroniza o estado de autenticação quando a aba/janela ganha foco
   */
  useEffect(() => {
    const handleFocus = () => {
      if (token && !isTokenValid()) {
        handleTokenRefresh();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [token, isTokenValid, handleTokenRefresh]);

  return {
    // Estado
    user,
    token,
    isAuthenticated: isAuthenticated && isTokenValid(),
    isLoading,
    error,
    
    // Ações
    authenticateUser,
    registerUser,
    logoutUser,
    refreshUserToken,
    syncAuth,
    clearAuth,
    
    // Utilidades
    isTokenValid,
    logout: logoutUser, // Alias para compatibilidade
    refreshToken: handleTokenRefresh, // Alias para compatibilidade
  };
};
