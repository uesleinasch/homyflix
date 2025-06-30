import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovieOperations } from "../../../core/hooks/useMovieOperations";
import type { Movie } from "../../../shared/types/movie";
import {
  ActionIcon,
  BackgroundImage,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Text,
  Title,
} from "@mantine/core";
import { ArrowLeftIcon, PenIcon, TrashIcon } from "@phosphor-icons/react";
import LoadScreen from "../../../shared/components/ui/loaderScreen";
import { useTheme } from "../../../shared/hooks/useTheme";
import styles from "./style.module.css";

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loadMovieById, deleteExistingMovie, loading } = useMovieOperations();
  const { isDark } = useTheme();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Refs para efeitos parallax
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroBackgroundRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const movieId = id ? parseInt(id) : null;

    if (!movieId || isNaN(movieId)) {
      setError("ID do filme inválido");
      setIsLoading(false);
      return;
    }

    loadMovieData(movieId);
  }, [id]);

  // Efeito parallax no mouse
  useEffect(() => {
    if (!movie) return;

    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updateParallax = () => {
      if (!heroBackgroundRef.current) return;

      const { innerWidth, innerHeight } = window;
      const xPercent = (mouseX / innerWidth - 0.5) * 15;
      const yPercent = (mouseY / innerHeight - 0.5) * 15;
      
      heroBackgroundRef.current.style.transform = 
        `translate(${xPercent}px, ${yPercent}px) scale(1.05)`;
      
      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [movie]);

  // Apenas funciona, pelo amor de GOD
  useEffect(() => {
    if (!movie) return;

    let rafId: number;
    let scrollY = 0;

    const handleScroll = () => {
      if (containerRef.current) {
        scrollY = containerRef.current.scrollTop;
      }
    };

    const updateScrollParallax = () => {
      if (!heroImageRef.current) return;

      const parallaxSpeed = 0.3;
      heroImageRef.current.style.transform = 
        `translateY(${scrollY * parallaxSpeed}px)`;
      
      rafId = requestAnimationFrame(updateScrollParallax);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      rafId = requestAnimationFrame(updateScrollParallax);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(rafId);
      };
    }
  }, [movie]);

  const loadMovieData = async (movieId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loadMovieById(movieId);
      if (result.success && result.data) {
        setMovie(result.data);
      } else {
        setError(result.error || "Filme não encontrado");
      }
    } catch {
      setError("Erro inesperado ao carregar filme");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = useCallback(() => {
    if (movie) {
      navigate(`/movies/${movie.id}/edit`);
    }
  }, [movie, navigate]);

  const handleDelete = useCallback(async () => {
    if (!movie) return;

    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o filme "${movie.title}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmDelete) {
      setIsDeleting(true);
      try {
        const result = await deleteExistingMovie(movie.id);

        if (result.success) {
          alert("Filme excluído com sucesso!");
          navigate("/movies");
        } else {
          alert(`Erro ao excluir filme: ${result.error}`);
        }
      } finally {
        setIsDeleting(false);
      }
    }
  }, [movie, deleteExistingMovie, navigate]);

  const handleBackToList = useCallback(() => {
    navigate("/movies");
  }, [navigate]);

  if (isLoading) {
    return (
      <LoadScreen 
        isLoading={true} 
        loadingText="Carregando detalhes do filme..." 
      />
    );
  }

  if (error) {
    return (
      <Box 
        p="xl" 
        style={{ 
          backgroundColor: isDark ? 'var(--mantine-color-dark-7)' : 'white',
          color: isDark ? 'white' : 'black',
          minHeight: '100vh'
        }}
      >
        <Title order={1} mb="md">Erro ao carregar filme</Title>
        <Text c="red" mb="xl">{error}</Text>
        <Flex gap="md">
          <Button onClick={handleBackToList} variant="outline" color="orange">
            ← Voltar para lista
          </Button>
          <Button onClick={() => id && loadMovieData(parseInt(id))} color="orange">
            Tentar novamente
          </Button>
        </Flex>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box 
        p="xl" 
        style={{ 
          backgroundColor: isDark ? 'var(--mantine-color-dark-7)' : 'white',
          color: isDark ? 'white' : 'black',
          minHeight: '100vh'
        }}
      >
        <Title order={1} mb="md">Filme não encontrado</Title>
        <Text mb="xl">O filme solicitado não foi encontrado.</Text>
        <Button onClick={handleBackToList} color="orange">
          ← Voltar para lista
        </Button>
      </Box>
    );
  }

  return (
    <>
      {isDeleting && (
        <LoadScreen 
          isLoading={true} 
          loadingText="Excluindo filme..." 
        />
      )}
      <div 
        ref={containerRef} 
        className={styles.container}
        data-theme={isDark ? 'dark' : 'light'}
      >
        <div 
          ref={heroImageRef} 
          className={styles.heroImage}
          style={{
            backgroundImage: movie?.poster_url ? `url(${movie.poster_url})` : 'none'
          }}
        >
          <div 
            ref={heroBackgroundRef}
            className={styles.heroImageBackground}
            style={{
              backgroundImage: movie?.poster_url ? `url(${movie.poster_url})` : 'none'
            }}
          />
        </div>
        <Box
          style={{ zIndex: 1001 }}
          mt={{ base: "200px", sm: "300px" }}
          pt={{ base: "md", sm: "30px" }}
          pb={{ base: "md", sm: "80px" }}
          pl={{ base: "0", sm: "300px" }}
          pr={{ base: "0", sm: "300px" }}
        >
          <Grid>
            <Grid.Col span={{base: 12, sm: 4}} p={{base: "22px", sm: "0"}} style={{ zIndex: 1001 }}>
              {movie.poster_url && (
                <Card p={0}>
                  <BackgroundImage
                  className={styles.poster}
                 
                    h={500}
                    w="100%"
                    src={movie.poster_url}
                  ></BackgroundImage>
                </Card>
              )}
            </Grid.Col>
            <Grid.Col span={{base: 12, sm: 8}} style={{ zIndex: 1001 }} p={{base: "22px", sm: "md"}}>
              <Box>
                <Title mb={20} c={isDark ? "white" : "dark"} order={2}>
                  {movie.title}
                </Title>
                <Flex gap={10} wrap="wrap" align="center">
                  <Button
                    leftSection={<PenIcon size={16} />}
                    onClick={handleEdit}
                    disabled={loading}
                    color="orange"
                  >
                    {loading ? "Carregando..." : `Editar Filme`}
                  </Button>
                  <ActionIcon
                    size="lg"
                    onClick={handleDelete}
                    disabled={loading}
                    color="orange"
                    variant="outline"
                  >
                    <TrashIcon size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="lg"
                    onClick={handleBackToList}
                    disabled={loading}
                    color="orange"
                    variant="outline"
                  >
                    <ArrowLeftIcon size={16} />
                  </ActionIcon>
                </Flex>
                <Divider my="md" />
                <Text size="lg" c={isDark ? "gray.2" : "dark"} fw={400} mb={20}>
                  {movie.synopsis}
                </Text>
                <Divider my="md" c={"gray.5"} />
                <Flex wrap={"wrap"} gap={10}>
                  <Badge color="orange">{movie.genre}</Badge>
                  <Badge variant="outline" color="orange">
                    Lançamento: {movie.release_year}
                  </Badge>
                </Flex>
              </Box>
            </Grid.Col>
          </Grid>
        </Box>
      </div>
 
    </>
  );
};

export default MovieDetail;
