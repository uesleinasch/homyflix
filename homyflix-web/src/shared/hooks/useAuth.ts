import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store/store';
import { logout, refreshToken, clearAuthState } from '../../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    error 
  } = useSelector((state: RootState) => state.auth);


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
   * Realiza logout do usuário
   */
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Remove estado local mesmo se a API falhar
      dispatch(clearAuthState());
    } finally {
      navigate('/login', { replace: true });
    }
  }, [dispatch, navigate]);

  /**
   * Tenta atualizar o token se estiver próximo da expiração
   */
  const handleTokenRefresh = useCallback(async () => {
    if (!token || !isTokenValid()) {
      await handleLogout();
      return;
    }

    try {
      await dispatch(refreshToken()).unwrap();
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      await handleLogout();
    }
  }, [token, isTokenValid, dispatch, handleLogout]);

  /**
   * Verifica o estado da autenticação na inicialização
   */
  useEffect(() => {
    const checkAuthState = async () => {
      if (token && !isTokenValid()) {
        await handleTokenRefresh();
      }
    };

    checkAuthState();
  }, [token, isTokenValid, handleTokenRefresh]);

  /**
   * Configura verificação periódica do token
   */
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const interval = setInterval(() => {
      if (!isTokenValid()) {
        handleTokenRefresh();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, token, isTokenValid, handleTokenRefresh]);

  return {
    user,
    token,
    isAuthenticated: isAuthenticated && isTokenValid(),
    isLoading,
    error,
    
    // Métodos
    logout: handleLogout,
    refreshToken: handleTokenRefresh,
    isTokenValid,
  };
};
