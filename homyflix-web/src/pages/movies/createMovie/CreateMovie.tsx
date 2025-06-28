import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMovieOperations } from '../../../hooks/useMovieOperations';

// Schema de validação baseado nas regras da API
const createMovieSchema = z.object({
  title: z.string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres'),
  release_year: z.number()
    .int('Ano deve ser um número inteiro')
    .min(1888, 'Ano deve ser maior ou igual a 1888')
    .max(new Date().getFullYear() + 5, 'Ano não pode ser muito distante no futuro'),
  genre: z.string()
    .min(1, 'Gênero é obrigatório')
    .max(100, 'Gênero deve ter no máximo 100 caracteres'),
  synopsis: z.string()
    .min(1, 'Sinopse é obrigatória'),
  poster_url: z.string()
    .url('URL inválida')
    .optional()
    .or(z.literal(''))
});

type CreateMovieFormData = z.infer<typeof createMovieSchema>;

const CreateMovie: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createNewMovie, updateExistingMovie, loadMovieById, loading } = useMovieOperations();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [movieLoadError, setMovieLoadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue
  } = useForm<CreateMovieFormData>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: {
      title: '',
      release_year: new Date().getFullYear(),
      genre: '',
      synopsis: '',
      poster_url: ''
    }
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
        title: '',
        release_year: new Date().getFullYear(),
        genre: '',
        synopsis: '',
        poster_url: ''
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
        setValue('title', movie.title);
        setValue('release_year', movie.release_year);
        setValue('genre', movie.genre);
        setValue('synopsis', movie.synopsis);
        setValue('poster_url', movie.poster_url || '');
      } else {
        setMovieLoadError(result.error || 'Erro ao carregar filme');
      }
    } catch {
      setMovieLoadError('Erro inesperado ao carregar filme');
    } finally {
      setIsLoadingMovie(false);
    }
  };

  const onSubmit = useCallback(async (data: CreateMovieFormData) => {
    setSuccessMessage(null);
    
    try {
      // Transformar string vazia em null para poster_url
      const movieData = {
        title: data.title,
        release_year: data.release_year,
        genre: data.genre,
        synopsis: data.synopsis,
        poster_url: data.poster_url || null
      };

      if (isEditMode && id) {
        const movieId = parseInt(id);
        const result = await updateExistingMovie(movieId, movieData);
        
        if (result.success) {
          setSuccessMessage('Filme atualizado com sucesso!');
          // Aguardar um momento para mostrar a mensagem antes de navegar
          setTimeout(() => {
            navigate('/movies');
          }, 2000);
        } else if (result.error) {
          // Mostrar erro específico
          setError('root', {
            type: 'manual',
            message: result.error
          });
        }
      } else {
        const result = await createNewMovie(movieData);
        
        if (result.success && result.data) {
          setSuccessMessage('Filme criado com sucesso!');
          // Aguardar um momento para mostrar a mensagem antes de navegar
          setTimeout(() => {
            navigate(`/movies/${result.data?.id}`);
          }, 2000);
        } else if (result.error) {
          // Mostrar erro específico
          setError('root', {
            type: 'manual',
            message: result.error
          });
        }
      }
    } catch {
      setError('root', {
        type: 'manual',
        message: `Erro ao ${isEditMode ? 'atualizar' : 'criar'} filme. Tente novamente.`
      });
    }
  }, [createNewMovie, updateExistingMovie, navigate, setError, isEditMode, id]);

  const handleCancel = useCallback(() => {
    navigate('/movies');
  }, [navigate]);

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
        <p style={{ color: 'red' }}>{movieLoadError}</p>
        <button onClick={() => navigate('/movies')}>
          Voltar para lista de filmes
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>{isEditMode ? 'Editar Filme' : 'Criar Novo Filme'}</h1>

      {/* Mensagem de sucesso */}
      {successMessage && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px', marginBottom: '16px', border: '1px solid #c3e6cb' }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Erro geral */}
        {errors.root && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', marginBottom: '16px', border: '1px solid #f5c6cb' }}>
            <p>{errors.root.message}</p>
          </div>
        )}

        {/* Título */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="title">Título *</label>
          <input
            id="title"
            type="text"
            {...register('title')}
            disabled={loading}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.title && <span style={{ color: 'red' }}>{errors.title.message}</span>}
        </div>

        {/* Ano de Lançamento */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="release_year">Ano de Lançamento *</label>
          <input
            id="release_year"
            type="number"
            {...register('release_year', { valueAsNumber: true })}
            disabled={loading}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.release_year && <span style={{ color: 'red' }}>{errors.release_year.message}</span>}
        </div>

        {/* Gênero */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="genre">Gênero *</label>
          <select
            id="genre"
            {...register('genre')}
            disabled={loading}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="">Selecione um gênero</option>
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
          {errors.genre && <span style={{ color: 'red' }}>{errors.genre.message}</span>}
        </div>

        {/* Sinopse */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="synopsis">Sinopse *</label>
          <textarea
            id="synopsis"
            {...register('synopsis')}
            disabled={loading}
            rows={5}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.synopsis && <span style={{ color: 'red' }}>{errors.synopsis.message}</span>}
        </div>

        {/* URL do Poster */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="poster_url">URL do Poster</label>
          <input
            id="poster_url"
            type="url"
            {...register('poster_url')}
            disabled={loading}
            placeholder="https://exemplo.com/poster.jpg"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.poster_url && <span style={{ color: 'red' }}>{errors.poster_url.message}</span>}
        </div>

        {/* Botões de ação */}
        <div style={{ marginTop: '24px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              padding: '12px 24px', 
              marginRight: '12px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading 
              ? (isEditMode ? 'Atualizando...' : 'Criando...') 
              : (isEditMode ? 'Atualizar Filme' : 'Criar Filme')
            }
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            style={{ 
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMovie;