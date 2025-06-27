export interface Movie {
  id: number;
  title: string;
  release_year: number;
  genre: string;
  director: string;
  synopsis: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export type MovieCreateData = Omit<Movie, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type MovieUpdateData = Partial<MovieCreateData>;

export interface MovieState {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
}
