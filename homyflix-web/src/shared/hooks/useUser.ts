import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userService, type UpdatePasswordData, type UpdateUserProfileData } from '../services/userService';
import { notifications } from '@mantine/notifications';
import { syncAuthState } from '../../store/slices/authSlice';
import { tokenManager } from '../../core/auth/tokenManager';
import type { RootState } from '../../store/store';

export const useUser = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePassword = useCallback(async (data: UpdatePasswordData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updatePassword(data);
      
      // Atualiza o usuário no token manager e no estado
      tokenManager.setCurrentUser(updatedUser);
      dispatch(syncAuthState());
      
      notifications.show({
        title: 'Sucesso',
        message: 'Senha alterada com sucesso!',
        color: 'green',
      });
      
      return { success: true, data: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao alterar senha';
      setError(errorMessage);
      
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const updateProfile = useCallback(async (data: UpdateUserProfileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateProfile(data);
      
      // Atualiza o usuário no token manager e no estado
      tokenManager.setCurrentUser(updatedUser);
      dispatch(syncAuthState());
      
      notifications.show({
        title: 'Sucesso',
        message: 'Perfil atualizado com sucesso!',
        color: 'green',
      });
      
      return { success: true, data: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    user,
    loading,
    error,
    updatePassword,
    updateProfile,
  };
}; 