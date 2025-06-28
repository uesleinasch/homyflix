import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store/store';
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
import type { MovieCreateData, MovieUpdateData } from '../types/movie';

export const useMovieOperations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector(selectMovies);
  const isLoading = useSelector(selectMoviesLoading);
  const error = useSelector(selectMoviesError);
  
  const [operationLoading, setOperationLoading] = useState(false);

  // Buscar todos os filmes
  const loadMovies = useCallback(async () => {
    try {
      await dispatch(fetchMovies()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  // Buscar filme por ID
  const loadMovieById = useCallback(async (id: number) => {
    try {
      const movie = await dispatch(fetchMovieById(id)).unwrap();
      return { success: true, data: movie };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  // Criar novo filme
  const handleCreateMovie = useCallback(async (movieData: MovieCreateData) => {
    setOperationLoading(true);
    try {
      const newMovie = await dispatch(createMovie(movieData)).unwrap();
      return { success: true, data: newMovie };
    } catch (error) {
      return { success: false, error: error as string };
    } finally {
      setOperationLoading(false);
    }
  }, [dispatch]);

  // Atualizar filme
  const handleUpdateMovie = useCallback(async (id: number, movieData: MovieUpdateData) => {
    setOperationLoading(true);
    try {
      const updatedMovie = await dispatch(updateMovie({ id, movieData })).unwrap();
      return { success: true, data: updatedMovie };
    } catch (error) {
      return { success: false, error: error as string };
    } finally {
      setOperationLoading(false);
    }
  }, [dispatch]);

  // Deletar filme
  const handleDeleteMovie = useCallback(async (id: number) => {
    setOperationLoading(true);
    try {
      await dispatch(deleteMovie(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    } finally {
      setOperationLoading(false);
    }
  }, [dispatch]);

  // Limpar erro
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

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
    createMovie: handleCreateMovie,
    updateMovie: handleUpdateMovie,
    deleteMovie: handleDeleteMovie,
    clearError: handleClearError,
    
    // Selectors
    getMovieById,
  };
}; 