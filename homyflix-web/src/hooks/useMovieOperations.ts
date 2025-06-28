import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store/store';
import {
  fetchMovies,
  fetchMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  clearError,
  selectMovies,
  selectMoviesLoading,
  selectMoviesError,
  selectMovieById,
} from '../store/slices/movieSlice';
import { clearAuthState } from '../store/slices/authSlice';
import type {  MovieCreateData, MovieUpdateData } from '../types/movie';

export const useMovieOperations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const movies = useSelector((state: RootState) => selectMovies(state));
  const isLoading = useSelector((state: RootState) => selectMoviesLoading(state));
  const error = useSelector((state: RootState) => selectMoviesError(state));
  
  const [operationLoading, setOperationLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Função para tratar erros de autenticação
  const handleAuthError = useCallback((errorMessage: string) => {
    if (errorMessage.includes('Sessão expirada') || errorMessage.includes('Token') || errorMessage.includes('401')) {
      console.log('Erro de autenticação detectado, fazendo logout...');
      dispatch(clearAuthState());
      navigate('/login', { replace: true });
      return true;
    }
    return false;
  }, [dispatch, navigate]);

  // Wrapper para operações que podem ter erro de auth
  const withAuthErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<{ success: boolean; data?: T; error?: string }> => {
    try {
      setOperationLoading(true);
      const result = await operation();
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado';
      
      // Trata erro de autenticação
      if (handleAuthError(errorMessage)) {
        return { success: false, error: 'Sessão expirada' };
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  }, [handleAuthError]);

  // Buscar todos os filmes
  const loadMovies = useCallback(async () => {
    try {
      setOperationLoading(true);
      const result = await dispatch(fetchMovies()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado';
      
      // Trata erro de autenticação
      if (handleAuthError(errorMessage)) {
        return { success: false, error: 'Sessão expirada' };
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  }, [dispatch, handleAuthError]);

  // Buscar filme por ID
  const loadMovieById = useCallback(async (id: number) => {
    return withAuthErrorHandling(async () => {
      const result = await dispatch(fetchMovieById(id)).unwrap();
      return result;
    });
  }, [dispatch, withAuthErrorHandling]);

  // Criar novo filme
  const createNewMovie = useCallback(async (movieData: MovieCreateData) => {
    return withAuthErrorHandling(async () => {
      const result = await dispatch(createMovie(movieData)).unwrap();
      return result;
    });
  }, [dispatch, withAuthErrorHandling]);

  // Atualizar filme
  const updateExistingMovie = useCallback(async (id: number, movieData: MovieUpdateData) => {
    return withAuthErrorHandling(async () => {
      const result = await dispatch(updateMovie({ id, movieData })).unwrap();
      return result;
    });
  }, [dispatch, withAuthErrorHandling]);

  // Deletar filme
  const deleteExistingMovie = useCallback(async (id: number) => {
    return withAuthErrorHandling(async () => {
      await dispatch(deleteMovie(id)).unwrap();
      return id;
    });
  }, [dispatch, withAuthErrorHandling]);

  // Limpar erro
  const clearMovieError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-load movies na inicialização - executa apenas uma vez
  useEffect(() => {
    if (!hasInitialized && movies.length === 0 && !isLoading) {
      console.log('Carregando filmes inicialmente...');
      setHasInitialized(true);
      dispatch(fetchMovies());
    }
  }, [hasInitialized, movies.length, isLoading, dispatch]);

  // Selector para buscar filme por ID
  const getMovieById = useCallback((id: number) => {
    return selectMovieById(id);
  }, []);

  return {
    // Estado
    movies,
    loading: isLoading || operationLoading,
    error,
    
    // Operações
    loadMovies,
    loadMovieById,
    createNewMovie,
    updateExistingMovie,
    deleteExistingMovie,
    clearMovieError,
    
    // Aliases para compatibilidade
    createMovie: createNewMovie,
    updateMovie: updateExistingMovie,
    deleteMovie: deleteExistingMovie,
    
    // Selectors
    getMovieById,
    
    // Utilidades
    refreshMovies: loadMovies
  };
}; 