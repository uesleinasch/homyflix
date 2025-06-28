<?php

namespace App\Application\Movie\UseCases;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Models\Movie;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetAllMoviesUseCase
{
    public function __construct(
        private readonly MovieRepositoryInterface $movieRepository
    ) {}

    /**
     * Executa o caso de uso para buscar todos os filmes
     *
     * @param int $perPage
     * @return LengthAwarePaginator|Movie[]
     */
    public function execute(int $perPage = 15): LengthAwarePaginator
    {
        return $this->movieRepository->findAll($perPage);
    }
} 