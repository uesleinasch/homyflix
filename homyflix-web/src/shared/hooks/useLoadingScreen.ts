import { useState, useCallback } from 'react';

interface UseLoadingScreenReturn {
  /**
   * Estado atual do loading
   */
  isLoading: boolean;
  /**
   * Função para mostrar o loading screen
   */
  showLoading: () => void;
  /**
   * Função para esconder o loading screen
   */
  hideLoading: () => void;
  /**
   * Função para alternar o estado do loading
   */
  toggleLoading: () => void;
  /**
   * Função para executar uma operação assíncrona com loading automático
   */
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