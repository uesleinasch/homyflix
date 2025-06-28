import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
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
  const { createMovie, loading } = useMovieOperations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
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

  const onSubmit = useCallback(async (data: CreateMovieFormData) => {
    try {
      // Transformar string vazia em undefined para poster_url
      const movieData = {
        title: data.title,
        release_year: data.release_year,
        genre: data.genre,
        synopsis: data.synopsis,
        poster_url: data.poster_url || null
      };

      const result = await createMovie(movieData);
      
      if (result.success && result.data) {
        navigate(`/movies/${result.data.id}`);
      } else if (result.error) {
        // Mostrar erro genérico
        setError('root', {
          type: 'manual',
          message: result.error
        });
      }
    } catch {
      setError('root', {
        type: 'manual',
        message: 'Erro ao criar filme. Tente novamente.'
      });
    }
  }, [createMovie, navigate, setError]);

  const handleCancel = useCallback(() => {
    navigate('/movies');
  }, [navigate]);

  return (
    <div>
      <h1>Criar Novo Filme</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Erro geral */}
        {errors.root && (
          <div>
            <p>{errors.root.message}</p>
          </div>
        )}

        {/* Título */}
        <div>
          <label htmlFor="title">Título *</label>
          <input
            id="title"
            type="text"
            {...register('title')}
            disabled={loading}
          />
          {errors.title && <span>{errors.title.message}</span>}
        </div>

        {/* Ano de Lançamento */}
        <div>
          <label htmlFor="release_year">Ano de Lançamento *</label>
          <input
            id="release_year"
            type="number"
            {...register('release_year', { valueAsNumber: true })}
            disabled={loading}
          />
          {errors.release_year && <span>{errors.release_year.message}</span>}
        </div>

        {/* Gênero */}
        <div>
          <label htmlFor="genre">Gênero *</label>
          <input
            id="genre"
            type="text"
            {...register('genre')}
            disabled={loading}
          />
          {errors.genre && <span>{errors.genre.message}</span>}
        </div>

        {/* Sinopse */}
        <div>
          <label htmlFor="synopsis">Sinopse *</label>
          <textarea
            id="synopsis"
            {...register('synopsis')}
            disabled={loading}
            rows={5}
          />
          {errors.synopsis && <span>{errors.synopsis.message}</span>}
        </div>

        {/* URL do Poster */}
        <div>
          <label htmlFor="poster_url">URL do Poster</label>
          <input
            id="poster_url"
            type="url"
            {...register('poster_url')}
            disabled={loading}
            placeholder="https://exemplo.com/poster.jpg"
          />
          {errors.poster_url && <span>{errors.poster_url.message}</span>}
        </div>

        {/* Botões de ação */}
        <div>
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Filme'}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMovie;