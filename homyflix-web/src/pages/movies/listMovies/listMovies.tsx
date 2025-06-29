import React, { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMovieOperations } from "../../../core/hooks/useMovieOperations";
import type { Movie } from "../../../types/movie";
import MantineContainer from "../../../shared/components/ui/mantineContainer/MantineContainer";

// Schema de validação para filtros
const FilterSchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  yearFrom: z.string().optional(),
  yearTo: z.string().optional(),
});

type FilterFormData = z.infer<typeof FilterSchema>;

// Componente de item do filme - memo para performance
const MovieItem = memo(
  ({
    movie,
    onView,
    onEdit,
    onDelete,
  }: {
    movie: Movie;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
  }) => {
    const handleDelete = useCallback(() => {
      if (
        window.confirm(
          `Tem certeza que deseja excluir o filme "${movie.title}"?`
        )
      ) {
        onDelete(movie.id);
      }
    }, [movie.id, movie.title, onDelete]);

    return (
      <MantineContainer>
        <div
          style={{ border: "1px solid #ccc", padding: "16px", margin: "8px 0" }}
        >
          <h3>{movie.title}</h3>
          <p>
            <strong>Ano:</strong> {movie.release_year}
          </p>
          <p>
            <strong>Gênero:</strong> {movie.genre}
          </p>
          <p>
            <strong>Sinopse:</strong> {movie.synopsis}
          </p>

          {movie.poster_url && (
            <p>
              <strong>Poster:</strong>{" "}
              <a
                href={movie.poster_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Poster
              </a>
            </p>
          )}
          <p>
            <strong>Criado em:</strong>{" "}
            {new Date(movie.created_at).toLocaleDateString("pt-BR")}
          </p>

          <div style={{ marginTop: "12px" }}>
            <button
              onClick={() => onView(movie.id)}
              style={{ marginRight: "8px" }}
            >
              Visualizar
            </button>
            <button
              onClick={() => onEdit(movie.id)}
              style={{ marginRight: "8px" }}
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              style={{ backgroundColor: "#dc3545", color: "white" }}
            >
              Excluir
            </button>
          </div>
        </div>
      </MantineContainer>
    );
  }
);

MovieItem.displayName = "MovieItem";

// Componente de filtros
const MovieFilters = memo(
  ({ onFilter }: { onFilter: (filters: FilterFormData) => void }) => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FilterFormData>({
      resolver: zodResolver(FilterSchema),
      defaultValues: {
        search: "",
        genre: "",
        yearFrom: "",
        yearTo: "",
      },
    });

    const onSubmit = useCallback(
      (data: FilterFormData) => {
        onFilter(data);
      },
      [onFilter]
    );

    const handleReset = useCallback(() => {
      reset();
      onFilter({});
    }, [reset, onFilter]);

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          marginBottom: "24px",
          padding: "16px",
          border: "1px solid #ddd",
        }}
      >
        <h3>Filtros</h3>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="search">Buscar por título:</label>
          <input
            id="search"
            type="text"
            placeholder="Digite o título do filme..."
            {...register("search")}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
          {errors.search && (
            <span style={{ color: "red" }}>{errors.search.message}</span>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="genre">Gênero:</label>
          <select
            id="genre"
            {...register("genre")}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="">Todos os gêneros</option>
            <option value="Action">Ação</option>
            <option value="Adventure">Aventura</option>
            <option value="Comedy">Comédia</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Terror</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Ficção Científica</option>
            <option value="Thriller">Suspense</option>
            <option value="Animation">Animação</option>
            <option value="Documentary">Documentário</option>
          </select>
          {errors.genre && (
            <span style={{ color: "red" }}>{errors.genre.message}</span>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="yearFrom">Ano de:</label>
            <input
              id="yearFrom"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="Ex: 2000"
              {...register("yearFrom")}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
            {errors.yearFrom && (
              <span style={{ color: "red" }}>{errors.yearFrom.message}</span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="yearTo">Ano até:</label>
            <input
              id="yearTo"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="Ex: 2024"
              {...register("yearTo")}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
            {errors.yearTo && (
              <span style={{ color: "red" }}>{errors.yearTo.message}</span>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            style={{ marginRight: "8px", padding: "8px 16px" }}
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{ padding: "8px 16px" }}
          >
            Limpar Filtros
          </button>
        </div>
      </form>
    );
  }
);

MovieFilters.displayName = "MovieFilters";

// Componente principal
const ListMovies: React.FC = () => {
  const navigate = useNavigate();
  const {
    movies,
    loading: isLoading,
    error,
    deleteExistingMovie,
    clearMovieError,
    refreshMovies,
  } = useMovieOperations();

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  // Atualizar filmes filtrados quando a lista de filmes mudar
  useEffect(() => {
    setFilteredMovies(movies);
  }, [movies]);

  // Limpar erro quando componente desmontar
  useEffect(() => {
    return () => {
      if (error) {
        clearMovieError();
      }
    };
  }, []); // Removendo dependências desnecessárias

  // Função de filtro
  const handleFilter = useCallback(
    (filters: FilterFormData) => {
      let filtered = [...movies];

      // Filtro por busca de título
      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim();
        filtered = filtered.filter(
          (movie) =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.synopsis.toLowerCase().includes(searchTerm)
        );
      }

      // Filtro por gênero
      if (filters.genre && filters.genre.trim()) {
        filtered = filtered.filter((movie) => movie.genre === filters.genre);
      }

      // Filtro por ano (de)
      if (filters.yearFrom && filters.yearFrom.trim()) {
        const yearFrom = parseInt(filters.yearFrom);
        filtered = filtered.filter((movie) => movie.release_year >= yearFrom);
      }

      // Filtro por ano (até)
      if (filters.yearTo && filters.yearTo.trim()) {
        const yearTo = parseInt(filters.yearTo);
        filtered = filtered.filter((movie) => movie.release_year <= yearTo);
      }

      setFilteredMovies(filtered);
    },
    [movies]
  );

  // Handlers de navegação
  const handleViewMovie = useCallback(
    (id: number) => {
      navigate(`/movies/${id}`);
    },
    [navigate]
  );

  const handleEditMovie = useCallback(
    (id: number) => {
      navigate(`/movies/${id}/edit`);
    },
    [navigate]
  );

  const handleCreateMovie = useCallback(() => {
    navigate("/movies/create");
  }, [navigate]);

  // Handler de exclusão
  const handleDeleteMovie = useCallback(
    async (id: number) => {
      const result = await deleteExistingMovie(id);
      if (!result.success && result.error) {
        console.error("Erro ao excluir filme:", result.error);
      }
    },
    [deleteExistingMovie]
  );

  // Recarregar dados
  const handleRefresh = useCallback(async () => {
    const result = await refreshMovies();
    if (!result.success && result.error) {
      console.error("Erro ao recarregar filmes:", result.error);
    }
  }, [refreshMovies]);

  // Loading state
  if (isLoading && movies.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Lista de Filmes</h1>
        <p>Carregando filmes...</p>
      </div>
    );
  }

  return (
    <MantineContainer>
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1>Lista de Filmes</h1>
        <div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            style={{ marginRight: "8px", padding: "8px 16px" }}
          >
            {isLoading ? "Atualizando..." : "Atualizar"}
          </button>
          <button
            onClick={handleCreateMovie}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
            }}
          >
            Novo Filme
          </button>
        </div>
      </div>

      {/* Filtros */}
      <MovieFilters onFilter={handleFilter} />

      {/* Error state */}
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            marginBottom: "16px",
            border: "1px solid #f5c6cb",
          }}
        >
          <strong>Erro:</strong> {error}
          <button
            onClick={clearMovieError}
            style={{
              marginLeft: "12px",
              background: "none",
              border: "none",
              color: "#721c24",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Movies count */}
      <div style={{ marginBottom: "16px" }}>
        <p>
          <strong>Total:</strong> {filteredMovies.length} filme(s) encontrado(s)
          {filteredMovies.length !== movies.length &&
            ` de ${movies.length} total`}
        </p>
      </div>

      {/* Movies list */}
      {filteredMovies.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Nenhum filme encontrado.</p>
          {movies.length === 0 ? (
            <button
              onClick={handleCreateMovie}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              Criar Primeiro Filme
            </button>
          ) : (
            <p>Tente ajustar os filtros de busca.</p>
          )}
        </div>
      ) : (
        <div>
          {filteredMovies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              onView={handleViewMovie}
              onEdit={handleEditMovie}
              onDelete={handleDeleteMovie}
            />
          ))}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && movies.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "4px",
            }}
          >
            Atualizando filmes...
          </div>
        </div>
      )}
    </div>
    </MantineContainer>

  );
};

export default ListMovies;
