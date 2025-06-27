export interface Movie {
  id: number;
  title: string;
  release_year: number;
  genre: string;
  synopsis: string;
}

export interface MovieState {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
}
