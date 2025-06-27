import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../../services/api';
import type { Movie, MovieState } from '../../types/movie';

const initialState: MovieState = {
  movies: [],
  isLoading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/movies');
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data);
  }
});

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData: Omit<Movie, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/movies', movieData);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, movieData }: { id: number; movieData: Partial<Omit<Movie, 'id'>> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/movies/${id}`, movieData);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

export const deleteMovie = createAsyncThunk('movies/deleteMovie', async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`/movies/${id}`);
    return id;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data);
  }
});

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.movies.push(action.payload);
      })
      .addCase(updateMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        const index = state.movies.findIndex((movie) => movie.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
      })
      .addCase(deleteMovie.fulfilled, (state, action: PayloadAction<number>) => {
        state.movies = state.movies.filter((movie) => movie.id !== action.payload);
      });
  },
});

export default movieSlice.reducer;
