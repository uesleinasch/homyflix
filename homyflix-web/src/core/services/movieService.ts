import api from '../auth/api';
import type { Movie, MovieCreateData, MovieUpdateData } from '../../types/movie';
import { isAxiosError } from 'axios';

interface ApiMovieResponse extends Omit<Movie, 'release_year'> {
  release_year: string | number;
}

const formatMovie = (movie: ApiMovieResponse): Movie => ({
  ...movie,
  release_year: Number(movie.release_year),
});

const handleApiError = (error: unknown): never => {
  if (isAxiosError(error)) {
    console.error("API Error:", error.response?.data);
    
    // Se for erro 401, deixa o useAuth hook gerenciar o logout
    if (error.response?.status === 401) {
      throw new Error('Sessão expirada. Você será redirecionado para o login.');
    }
    
    throw new Error(error.response?.data?.message || 'Erro de comunicação com a API');
  } else if (error instanceof Error) {
    console.error("Application Error:", error.message);
    throw new Error('Ocorreu um erro na aplicação.');
  } else {
    console.error("Unknown Error:", error);
    throw new Error('Ocorreu um erro inesperado.');
  }
};

export const movieService = {
  async getAllMovies(): Promise<Movie[]> {
    try {
      const { data } = await api.get<{ data: ApiMovieResponse[] }>('/movies');
      return data.data.map(formatMovie);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getMovieById(id: number): Promise<Movie> {
    try {
      const { data } = await api.get<{ data: ApiMovieResponse }>(`/movies/${id}`);
      return formatMovie(data.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createMovie(movieData: MovieCreateData): Promise<Movie> {
    try {
      const { data } = await api.post<{ data: ApiMovieResponse }>('/movies', movieData);
      return formatMovie(data.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateMovie(id: number, movieData: MovieUpdateData): Promise<Movie> {
    try {
      const { data } = await api.put<{ data: ApiMovieResponse }>(`/movies/${id}`, movieData);
      return formatMovie(data.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteMovie(id: number): Promise<void> {
    try {
      await api.delete(`/movies/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
};
