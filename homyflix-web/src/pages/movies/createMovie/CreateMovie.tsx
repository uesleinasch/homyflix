import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMovieOperations } from "../../../core/hooks/useMovieOperations";
import MantineContainer from "../../../shared/components/ui/mantineContainer/MantineContainer";
import {
  Alert,
  BackgroundImage,
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Loader,
  Paper,
  Space,
  TextInput,
  Textarea,
  Select,
  ActionIcon,
} from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { FloppyDiskBackIcon, InfoIcon, XIcon } from "@phosphor-icons/react";
import Header from "../../../shared/components/ui/header/Header";
import styles from "./style.module.css";

// Schema de validação baseado nas regras da API
const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título deve ter no máximo 255 caracteres"),
  release_year: z
    .number()
    .int("Ano deve ser um número inteiro")
    .min(1888, "Ano deve ser maior ou igual a 1888")
    .max(
      new Date().getFullYear() + 5,
      "Ano não pode ser muito distante no futuro"
    ),
  genre: z
    .string()
    .min(1, "Gênero é obrigatório")
    .max(100, "Gênero deve ter no máximo 100 caracteres"),
  synopsis: z.string().min(1, "Sinopse é obrigatória"),
  poster_url: z.string().url("URL inválida").optional().or(z.literal("")),
});

type CreateMovieFormData = z.infer<typeof createMovieSchema>;

const CreateMovie: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createNewMovie, updateExistingMovie, loadMovieById, loading } =
    useMovieOperations();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [movieLoadError, setMovieLoadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
    control,
  } = useForm<CreateMovieFormData>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: {
      title: "",
      release_year: new Date().getFullYear(),
      genre: "",
      synopsis: "",
      poster_url: "",
    },
  });

  // Determinar se é modo de edição e carregar dados do filme
  useEffect(() => {
    const movieId = id ? parseInt(id) : null;

    if (movieId && !isNaN(movieId)) {
      setIsEditMode(true);
      loadMovieData(movieId);
    } else {
      setIsEditMode(false);
      // Resetar formulário para modo de criação
      reset({
        title: "",
        release_year: new Date().getFullYear(),
        genre: "",
        synopsis: "",
        poster_url: "",
      });
    }
  }, [id, reset, loadMovieById, setValue]);

  const loadMovieData = async (movieId: number) => {
    setIsLoadingMovie(true);
    setMovieLoadError(null);

    try {
      const result = await loadMovieById(movieId);
      if (result.success && result.data) {
        const movie = result.data;
        // Preencher formulário com dados do filme
        setValue("title", movie.title);
        setValue("release_year", movie.release_year);
        setValue("genre", movie.genre);
        setValue("synopsis", movie.synopsis);
        setValue("poster_url", movie.poster_url || "");

        // Carregar preview da imagem se existir
        if (movie.poster_url) {
          validateAndLoadImage(movie.poster_url);
        }
      } else {
        setMovieLoadError(result.error || "Erro ao carregar filme");
      }
    } catch {
      setMovieLoadError("Erro inesperado ao carregar filme");
    } finally {
      setIsLoadingMovie(false);
    }
  };

  const onSubmit = useCallback(
    async (data: CreateMovieFormData) => {
      setSuccessMessage(null);

      try {
        // Transformar string vazia em null para poster_url
        const movieData = {
          title: data.title,
          release_year: data.release_year,
          genre: data.genre,
          synopsis: data.synopsis,
          poster_url: data.poster_url || null,
        };

        if (isEditMode && id) {
          const movieId = parseInt(id);
          const result = await updateExistingMovie(movieId, movieData);

          if (result.success) {
            setSuccessMessage("Filme atualizado com sucesso!");
            // Aguardar um momento para mostrar a mensagem antes de navegar
            setTimeout(() => {
              navigate("/movies");
            }, 2000);
          } else if (result.error) {
            // Mostrar erro específico
            setError("root", {
              type: "manual",
              message: result.error,
            });
          }
        } else {
          const result = await createNewMovie(movieData);

          if (result.success && result.data) {
            setSuccessMessage("Filme criado com sucesso!");
            // Aguardar um momento para mostrar a mensagem antes de navegar
            setTimeout(() => {
              navigate(`/movies/${result.data?.id}`);
            }, 2000);
          } else if (result.error) {
            // Mostrar erro específico
            setError("root", {
              type: "manual",
              message: result.error,
            });
          }
        }
      } catch {
        setError("root", {
          type: "manual",
          message: `Erro ao ${
            isEditMode ? "atualizar" : "criar"
          } filme. Tente novamente.`,
        });
      }
    },
    [createNewMovie, updateExistingMovie, navigate, setError, isEditMode, id]
  );

  const handleCancel = useCallback(() => {
    navigate("/movies");
  }, [navigate]);

  // Função para validar e carregar preview da imagem
  const validateAndLoadImage = useCallback((url: string) => {
    if (!url.trim()) {
      setPosterPreview(null);
      setImageError(null);
      return;
    }

    // Validar se é uma URL válida
    try {
      new URL(url);
    } catch {
      setImageError("URL inválida");
      setPosterPreview(null);
      return;
    }

    setIsImageLoading(true);
    setImageError(null);

    // Cadastrar nova imagem para testar se carrega
    const img = new Image();

    img.onload = () => {
      setPosterPreview(url);
      setImageError(null);
      setIsImageLoading(false);
    };

    img.onerror = () => {
      setImageError("Não foi possível carregar a imagem");
      setPosterPreview(null);
      setIsImageLoading(false);
    };

    img.src = url;
  }, []);

  // Função para lidar com mudanças no campo de URL do poster
  const handlePosterUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;

      // Atualizar o valor do formulário
      setValue("poster_url", url);

      // Debounce para evitar muitas requisições
      const timeoutId = setTimeout(() => {
        validateAndLoadImage(url);
      }, 500);

      return () => clearTimeout(timeoutId);
    },
    [setValue, validateAndLoadImage]
  );

  // Loading state para carregamento do filme
  if (isEditMode && isLoadingMovie) {
    return (
      <div>
        <h1>Carregando filme...</h1>
        <p>Por favor, aguarde enquanto carregamos os dados do filme.</p>
      </div>
    );
  }

  // Error state para carregamento do filme
  if (isEditMode && movieLoadError) {
    return (
      <div>
        <h1>Erro ao carregar filme</h1>
        <p style={{ color: "red" }}>{movieLoadError}</p>
        <button onClick={() => navigate("/movies")}>
          Voltar para lista de filmes
        </button>
      </div>
    );
  }

  return (
    <MantineContainer>
      <Header title={isEditMode ? "Editar Filme" : "Cadastrar Novo Filme"}>
        <ActionIcon
          size={40}
          className={styles.mobileSaveButton}
          variant="filled"
          color="orange"
          onClick={handleSubmit(onSubmit)}
        >
          <FloppyDiskBackIcon size={24} />
        </ActionIcon>
        <Flex gap={"md"} className={styles.desktopSaveButton}>
          <Button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            disabled={loading}
            color="orange"
            leftSection={<FloppyDiskBackIcon size={16} />}
          >
            {loading
              ? isEditMode
                ? "Atualizando..."
                : "Criando..."
              : isEditMode
              ? "Atualizar Filme"
              : "Cadastrar Filme"}
          </Button>

          <Button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            color="gray"
            leftSection={<XIcon size={16} />}
          >
            Cancelar
          </Button>
        </Flex>
      </Header>
      <div>
        {/* Mensagem de sucesso */}
        {successMessage && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "12px",
              marginBottom: "16px",
              border: "1px solid #c3e6cb",
            }}
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            pt={{ base: "md", sm: "100px" }}
            pb={{ base: "md", sm: "80px" }}
            pl={{ base: "0", sm: "300px" }}
            pr={{ base: "0", sm: "300px" }}
          >
            <Paper shadow="xs" p="xl">
              <Grid justify="center">
                <Grid.Col
                  span={{
                    base: 12,
                    md: 6,
                    lg:
                      posterPreview && !isImageLoading && !imageError ? 8 : 12,
                  }}
                >
                  {/* Erro geral */}
                  {errors.root && (
                    <div
                      style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        padding: "12px",
                        marginBottom: "16px",
                        border: "1px solid #f5c6cb",
                      }}
                    >
                      <p>{errors.root.message}</p>
                    </div>
                  )}

                  {/* Título */}
                  <TextInput
                    label="Título *"
                    {...register("title")}
                    disabled={loading}
                    error={errors.title?.message}
                    mb="md"
                  />

                  {/* Ano de Lançamento */}
                  <Controller
                    name="release_year"
                    control={control}
                    render={({ field }) => (
                      <YearPickerInput
                        label="Ano de Lançamento *"
                        value={
                          field.value
                            ? new Date(Number(field.value), 0, 1)
                            : null
                        }
                        onChange={(value: string | null) => {
                          if (value) {
                            const year = parseInt(value);
                            field.onChange(year);
                          } else {
                            field.onChange(new Date().getFullYear());
                          }
                        }}
                        disabled={loading}
                        error={errors.release_year?.message}
                        mb="md"
                        minDate={new Date(1888, 0, 1)}
                        maxDate={new Date(new Date().getFullYear() + 5, 0, 1)}
                      />
                    )}
                  />

                  {/* Gênero */}
                  <Controller
                    name="genre"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Gênero *"
                        placeholder="Selecione um gênero"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={loading}
                        error={errors.genre?.message}
                        mb="md"
                        data={[
                          { value: "Action", label: "Ação" },
                          { value: "Adventure", label: "Aventura" },
                          { value: "Comedy", label: "Comédia" },
                          { value: "Drama", label: "Drama" },
                          { value: "Horror", label: "Terror" },
                          { value: "Romance", label: "Romance" },
                          { value: "Sci-Fi", label: "Ficção Científica" },
                          { value: "Thriller", label: "Suspense" },
                          { value: "Animation", label: "Animação" },
                          { value: "Documentary", label: "Documentário" },
                        ]}
                      />
                    )}
                  />

                  {/* Sinopse */}
                  <Textarea
                    label="Sinopse *"
                    {...register("synopsis")}
                    disabled={loading}
                    rows={5}
                    error={errors.synopsis?.message}
                    mb="md"
                  />

                  {/* URL do Poster */}
                  <TextInput
                    label="URL do Poster"
                    type="url"
                    {...register("poster_url")}
                    onChange={handlePosterUrlChange}
                    disabled={loading}
                    placeholder="https://exemplo.com/poster.jpg"
                    error={errors.poster_url?.message}
                    mb="md"
                  />
                </Grid.Col>
                {posterPreview && !isImageLoading && !imageError && (
                  <Grid.Col
                    span={{ base: 12, md: 6, lg: 4 }}
                    pt={{ base: "md", sm: "0" }}
                  >
                    {/* Preview da imagem */}
                    <Group>
                      {isImageLoading && (
                        <Loader color="orange" size="xl" type="dots" />
                      )}

                      {imageError && (
                        <Paper w={"100%"}>
                          <Alert
                            variant="light"
                            color="orange"
                            title="Erro ao buscar imagem"
                            icon={<InfoIcon size={16} />}
                          >
                            {imageError}
                          </Alert>
                        </Paper>
                      )}

                      {posterPreview && !isImageLoading && !imageError && (
                        <>
                          <Box maw={"100%"} mx="auto">
                            <BackgroundImage
                              bd={1}
                              bdrs={20}
                              w={350}
                              h={500}
                              src={posterPreview}
                              radius="sm"
                            >
                              <Space w={"100%"} p={"lg"} h="100%" />
                            </BackgroundImage>
                          </Box>
                        </>
                      )}
                    </Group>
                  </Grid.Col>
                )}
              </Grid>
            </Paper>
          </Box>
        </form>
      </div>
    </MantineContainer>
  );
};

export default CreateMovie;
