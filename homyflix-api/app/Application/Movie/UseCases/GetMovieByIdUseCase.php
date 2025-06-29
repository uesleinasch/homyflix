<?php

namespace App\Application\Movie\UseCases;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Models\Movie;

class GetMovieByIdUseCase
{
    public function __construct(
        private readonly MovieRepositoryInterface $movieRepository
    ) {}

    /**
     * Executa o caso de uso para buscar um filme por ID
     *
     * @param int $movieId
     * @param int|null $userId - Se fornecido, verifica se o filme pertence ao usuário
     * @return Movie
     * @throws MovieNotFoundException
     */
    public function execute(int $movieId, ?int $userId = null): Movie
    {
        $movie = $userId 
            ? $this->movieRepository->findByIdAndUser($movieId, $userId)
            : $this->movieRepository->findById($movieId);

        if (!$movie) {
            throw new MovieNotFoundException(
                $userId ? 'Filme não encontrado ou você não tem permissão para visualizá-lo.' 
                       : 'Filme não encontrado.'
            );
        }

        return $movie;
    }
} 