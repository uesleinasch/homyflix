export interface Movie {
  id: number;
  title: string;
  release_year: number;
  genre: string;
  synopsis: string;
  poster_url: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Tipo para criar um filme - apenas os campos que a API aceita no POST
export type MovieCreateData = {
  title: string;
  release_year: number;
  genre: string;
  synopsis: string;
  poster_url?: string | null;
};

// Tipo para atualizar um filme - todos os campos são opcionais
export type MovieUpdateData = Partial<MovieCreateData>;

export interface MovieState {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
}
