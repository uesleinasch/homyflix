import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { movieService } from '../../core/services/movieService';
import type { Movie, MovieState, MovieCreateData, MovieUpdateData } from '../../types/movie';

const initialState: MovieState = {
  movies: [],
  isLoading: false,
  error: null,
};

// Async thunks usando o movieService
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      return await movieService.getAllMovies();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar filmes';
      return rejectWithValue(message);
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await movieService.getMovieById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar filme';
      return rejectWithValue(message);
    }
  }
);

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData: MovieCreateData, { rejectWithValue }) => {
    try {
      return await movieService.createMovie(movieData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar filme';
      return rejectWithValue(message);
    }
  }
);

export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, movieData }: { id: number; movieData: MovieUpdateData }, { rejectWithValue }) => {
    try {
      return await movieService.updateMovie(id, movieData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar filme';
      return rejectWithValue(message);
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id: number, { rejectWithValue }) => {
    try {
      await movieService.deleteMovie(id);
      return id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao deletar filme';
      return rejectWithValue(message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Ações síncronas se necessário
    clearError: (state) => {
      state.error = null;
    },
    clearMovies: (state) => {
      state.movies = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.movies = action.payload;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Movie By Id
      .addCase(fetchMovieById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        // Atualiza o filme na lista se ele já existir
        const index = state.movies.findIndex((movie) => movie.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        } else {
          state.movies.push(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Movie
      .addCase(createMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        state.movies.push(action.payload);
        state.error = null;
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Movie
      .addCase(updateMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        const index = state.movies.findIndex((movie) => movie.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Movie
      .addCase(deleteMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.movies = state.movies.filter((movie) => movie.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportar actions
export const { clearError, clearMovies } = movieSlice.actions;

// Selectors
export const selectMovies = (state: { movies: MovieState }) => state.movies.movies;
export const selectMoviesLoading = (state: { movies: MovieState }) => state.movies.isLoading;
export const selectMoviesError = (state: { movies: MovieState }) => state.movies.error;
export const selectMovieById = (id: number) => (state: { movies: MovieState }) =>
  state.movies.movies.find((movie) => movie.id === id);

export default movieSlice.reducer;
