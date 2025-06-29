import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieOperations } from '../../../core/hooks/useMovieOperations';
import type { Movie } from '../../../shared/types/movie';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loadMovieById, deleteExistingMovie, loading } = useMovieOperations();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do filme
  useEffect(() => {
    const movieId = id ? parseInt(id) : null;
    
    if (!movieId || isNaN(movieId)) {
      setError('ID do filme inválido');
      setIsLoading(false);
      return;
    }

    loadMovieData(movieId);
  }, [id]);

  const loadMovieData = async (movieId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loadMovieById(movieId);
      if (result.success && result.data) {
        setMovie(result.data);
      } else {
        setError(result.error || 'Filme não encontrado');
      }
    } catch {
      setError('Erro inesperado ao carregar filme');
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
      const result = await deleteExistingMovie(movie.id);
      
      if (result.success) {
        alert('Filme excluído com sucesso!');
        navigate('/movies');
      } else {
        alert(`Erro ao excluir filme: ${result.error}`);
      }
    }
  }, [movie, deleteExistingMovie, navigate]);

  const handleBackToList = useCallback(() => {
    navigate('/movies');
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div>
        <h1>Carregando filme...</h1>
        <p>Por favor, aguarde enquanto carregamos os detalhes do filme.</p>
        <button onClick={handleBackToList}>
          ← Voltar para lista
        </button>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <h1>Erro ao carregar filme</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleBackToList} style={{ marginRight: '10px' }}>
            ← Voltar para lista
          </button>
          <button onClick={() => id && loadMovieData(parseInt(id))}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Movie not found
  if (!movie) {
    return (
      <div>
        <h1>Filme não encontrado</h1>
        <p>O filme solicitado não foi encontrado.</p>
        <button onClick={handleBackToList}>
          ← Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleBackToList} style={{ marginBottom: '10px' }}>
          ← Voltar para lista
        </button>
        <h1>{movie.title}</h1>
      </div>

      {/* Movie Details */}
      <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
        {/* Poster */}
        {movie.poster_url && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Poster:</h3>
            <img 
              src={movie.poster_url} 
              alt={`Poster do filme ${movie.title}`}
              style={{ maxWidth: '300px', maxHeight: '400px', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <br />
            <a href={movie.poster_url} target="_blank" rel="noopener noreferrer">
              Ver poster em tamanho original
            </a>
          </div>
        )}

        {/* Basic Info */}
        <div style={{ marginBottom: '15px' }}>
          <h3>Informações Básicas:</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                  ID:
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {movie.id}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                  Título:
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {movie.title}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                  Ano de Lançamento:
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {movie.release_year}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                  Gênero:
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {movie.genre}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                  Criado em:
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {new Date(movie.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                  Última atualização:
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {new Date(movie.updated_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Synopsis */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Sinopse:</h3>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f9f9f9', 
            border: '1px solid #e0e0e0',
            lineHeight: '1.6'
          }}>
            {movie.synopsis}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '30px' }}>
        <h3>Ações:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleEdit}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Carregando...' : '✏️ Editar Filme'}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Carregando...' : '🗑️ Excluir Filme'}
          </button>
          
          <button
            onClick={handleBackToList}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📋 Ver Todos os Filmes
          </button>
        </div>
      </div>

      {/* Debug Info (apenas em desenvolvimento) */}
      {import.meta.env.DEV && (
        <details style={{ marginTop: '40px', fontSize: '12px' }}>
          <summary>Debug Info (desenvolvimento)</summary>
          <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(movie, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default MovieDetail;