<?php

namespace App\Application\Movie\UseCases;

use App\Application\Movie\DTOs\UpdateMovieDTO;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Domain\Movie\Exceptions\MovieUpdateException;
use App\Models\Movie;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateMovieUseCase
{
    public function __construct(
        private readonly MovieRepositoryInterface $movieRepository
    ) {}

    /**
     * Executa o caso de uso para atualizar um filme
     *
     * @param int $movieId
     * @param UpdateMovieDTO $updateMovieDTO
     * @param int|null $userId - Se fornecido, verifica se o filme pertence ao usuário
     * @return Movie
     * @throws MovieNotFoundException
     * @throws MovieUpdateException
     */
    public function execute(int $movieId, UpdateMovieDTO $updateMovieDTO, ?int $userId = null): Movie
    {
        try {
            return DB::transaction(function () use ($movieId, $updateMovieDTO, $userId) {
                // Verifica se o filme existe e se pertence ao usuário (se especificado)
                $movie = $userId 
                    ? $this->movieRepository->findByIdAndUser($movieId, $userId)
                    : $this->movieRepository->findById($movieId);

                if (!$movie) {
                    throw new MovieNotFoundException(
                        $userId ? 'Filme não encontrado ou você não tem permissão para editá-lo.' 
                               : 'Filme não encontrado.'
                    );
                }

                $updateData = $updateMovieDTO->toArray();
                
                // Se não há dados para atualizar, retorna o filme atual
                if (empty($updateData)) {
                    return $movie;
                }

                $updatedMovie = $this->movieRepository->update($movieId, $updateData);
                
                Log::info('Filme atualizado com sucesso', [
                    'movie_id' => $movieId,
                    'user_id' => $movie->user_id,
                    'updated_fields' => array_keys($updateData),
                    'timestamp' => now()
                ]);
                
                return $updatedMovie;
            });
        } catch (MovieNotFoundException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('Erro ao atualizar filme', [
                'error' => $e->getMessage(),
                'movie_id' => $movieId,
                'user_id' => $userId,
                'update_data' => $updateMovieDTO->toArray(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw new MovieUpdateException(
                'Não foi possível atualizar o filme. Tente novamente.',
                500,
                $e
            );
        }
    }
} 