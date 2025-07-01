import { useState, useCallback } from 'react';

interface UseLoadingScreenReturn {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  toggleLoading: () => void;
  withLoading: <T>(operation: () => Promise<T>) => Promise<T>;
}

/**
 * Hook customizado para gerenciar o estado de loading da aplicação
 * 
 * @param initialState - Estado inicial do loading (padrão: false)
 * @returns Objeto com estado e funções de controle do loading
 */
export const useLoadingScreen = (initialState: boolean = false): UseLoadingScreenReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);

  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const toggleLoading = useCallback(() => {
    setIsLoading(prev => !prev);
  }, []);

  const withLoading = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    try {
      setIsLoading(true);
      return await operation();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    showLoading,
    hideLoading,
    toggleLoading,
    withLoading,
  };
}; 