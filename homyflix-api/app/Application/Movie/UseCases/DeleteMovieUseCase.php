<?php

namespace App\Application\Movie\UseCases;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Models\Movie;
use Illuminate\Support\Facades\Log;

class DeleteMovieUseCase
{
    public function __construct(
        private readonly MovieRepositoryInterface $movieRepository
    ) {}

    /**
     * Executa o caso de uso para deletar um filme
     *
     * @param int $movieId
     * @param int|null $userId - Se fornecido, verifica se o filme pertence ao usuário
     * @return bool
     * @throws MovieNotFoundException
     */
    public function execute(int $movieId, ?int $userId = null): bool
    {
        // Verifica se o filme existe e se pertence ao usuário (se especificado)
        $movie = $userId 
            ? $this->movieRepository->findByIdAndUser($movieId, $userId)
            : $this->movieRepository->findById($movieId);

        if (!$movie) {
            throw new MovieNotFoundException(
                $userId ? 'Filme não encontrado ou você não tem permissão para excluí-lo.' 
                       : 'Filme não encontrado.'
            );
        }

        $deleted = $this->movieRepository->delete($movieId);
        
        if ($deleted) {
            Log::info('Filme deletado com sucesso', [
                'movie_id' => $movieId,
                'user_id' => $movie->user_id,
                'title' => $movie->title,
                'timestamp' => now()
            ]);
        }
        
        return $deleted;
    }
} 