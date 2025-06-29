import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieOperations } from "../../../core/hooks/useMovieOperations";
import type { Movie } from "../../../shared/types/movie";
import MantineContainer from "../../../shared/components/ui/mantineContainer/MantineContainer";
import Header from "../../../shared/components/ui/header/Header";
import LoadScreen from "../../../shared/components/ui/loaderScreen";
import { Alert, Box, Button, Flex, Grid, Stack, Text } from "@mantine/core";
import { MovieItem, MovieFilters, type FilterFormData } from "./Components";
import { ArrowsCounterClockwiseIcon, InfoIcon } from "@phosphor-icons/react";

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

  // Loading state - Primeira carga
  if (isLoading && movies.length === 0) {
    return (
      <LoadScreen 
        isLoading={true} 
        loadingText="Carregando lista de filmes..." 
      />
    );
  }

  return (
    <MantineContainer>
      <Header title="Lista de Filmes">
        <Flex gap="xs" wrap="wrap" display={{ base: "none", sm: "flex" }}>
          <Button
            variant="outline"
            color="gray"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <ArrowsCounterClockwiseIcon size={16} />
            Atualizar
          </Button>
          <Button onClick={handleCreateMovie}>Novo Filme</Button>
        </Flex>
      </Header>

      <Box mb={{ base: "0px", sm: "lg" }}>
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

        {/* Movies list */}
        {filteredMovies.length === 0 ? (
          <Stack>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Alert
                icon={<InfoIcon size={16} />}
                color="orange"
                radius="md"
                p={{ base: "sm", sm: "md" }}
              >
                <Text>Nenhum filme encontrado.</Text>
                <Button
                  onClick={handleCreateMovie}
                  variant="outline"
                  color="orange"
                  radius="md"
                  mt="md"
                >
                  Cadastrar Filme
                </Button>
              </Alert>
              {movies.length === 0 && (
              <Button
                onClick={handleCreateMovie}
                variant="outline"
                color="orange"
                radius="md"
                mt="md"
              >
                Cadastrar Filme
              </Button>
              )}
            </div>
          </Stack>
        ) : (
          <div>
            {/* Movies count */}
            <Box mb={{ base: "md", sm: "lg" }}>
              <Text size="sm" c={"var(--text-secondary)"}>
                {filteredMovies.length} filme(s) encontrado(s)
                {filteredMovies.length !== movies.length &&
                  ` de ${movies.length} total`}
              </Text>
            </Box>

            <Grid>
              {filteredMovies.map((movie) => (
                <MovieItem
                  key={movie.id}
                  movie={movie}
                  onView={handleViewMovie}
                  onEdit={handleEditMovie}
                  onDelete={handleDeleteMovie}
                />
              ))}
            </Grid>
          </div>
        )}

        {/* Loading overlay para refresh */}
        {isLoading && movies.length > 0 && (
          <LoadScreen 
            isLoading={true} 
            loadingText="Atualizando lista de filmes..." 
          />
        )}
      </Box>
    </MantineContainer>
  );
};

export default ListMovies;
