<?php

namespace App\Application\Movie\UseCases;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Models\Movie;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetUserMoviesUseCase
{
    public function __construct(
        private readonly MovieRepositoryInterface $movieRepository
    ) {}

    /**
     * Executa o caso de uso para buscar filmes de um usuário específico
     *
     * @param int $userId
     * @param int $perPage
     * @return LengthAwarePaginator|Movie[]
     */
    public function execute(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->movieRepository->findAllByUser($userId, $perPage);
    }
} 