// Custom Hook para operações de autenticação
import { useCallback } from 'react';
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
      navigate('/login');
      return { success: true };
    } catch (error) {
      dispatch(clearAuthState());
      navigate('/login');
      return { success: false, error: error as string };
    }
  }, [dispatch, navigate]);

  const refreshUserToken = useCallback(async () => {
    try {
      const result = await dispatch(refreshToken()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      dispatch(clearAuthState());
      navigate('/login');
      return { success: false, error: error as string };
    }
  }, [dispatch, navigate]);

  const syncAuth = useCallback(() => {
    dispatch(syncAuthState());
  }, [dispatch]);

  const clearAuth = useCallback(() => {
    dispatch(clearAuthState());
    navigate('/login');
  }, [dispatch, navigate]);

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Ações
    authenticateUser,
    registerUser,
    logoutUser,
    refreshUserToken,
    syncAuth,
    clearAuth,
  };
};
