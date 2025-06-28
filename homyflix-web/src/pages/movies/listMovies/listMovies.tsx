import React, { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieOperations } from '../../../hooks/useMovieOperations';

const ListMovies = memo(() => {
  const navigate = useNavigate();
  const { movies, loading, error, loadMovies, clearError } = useMovieOperations();

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    if (error) {
      // Podemos mostrar um toast ou notificação aqui
      console.error('Erro ao carregar filmes:', error);
    }
  }, [error]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const handleRetry = () => {
    clearError();
    loadMovies();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Nenhum filme encontrado</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lista de Filmes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieClick(movie.id)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
            <p className="text-gray-600 mb-1">Ano: {movie.release_year}</p>
            <p className="text-gray-600 mb-1">Gênero: {movie.genre}</p>
            <p className="text-gray-600 mb-3">Diretor: {movie.director}</p>
            <p className="text-gray-700 line-clamp-3">{movie.synopsis}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

ListMovies.displayName = 'ListMovies';

export default ListMovies;