<?php

namespace App\Application\Movie\Services;

use App\Application\Movie\DTOs\CreateMovieDTO;
use App\Application\Movie\DTOs\UpdateMovieDTO;
use App\Application\Movie\UseCases\CreateMovieUseCase;
use App\Application\Movie\UseCases\DeleteMovieUseCase;
use App\Application\Movie\UseCases\GetAllMoviesUseCase;
use App\Application\Movie\UseCases\GetMovieByIdUseCase;
use App\Application\Movie\UseCases\GetUserMoviesUseCase;
use App\Application\Movie\UseCases\UpdateMovieUseCase;
use App\Models\Movie;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MovieApplicationService
{
    public function __construct(
        private readonly CreateMovieUseCase $createMovieUseCase,
        private readonly UpdateMovieUseCase $updateMovieUseCase,
        private readonly DeleteMovieUseCase $deleteMovieUseCase,
        private readonly GetMovieByIdUseCase $getMovieByIdUseCase,
        private readonly GetAllMoviesUseCase $getAllMoviesUseCase,
        private readonly GetUserMoviesUseCase $getUserMoviesUseCase
    ) {}

    /**
     * Cria um novo filme
     *
     * @param CreateMovieDTO $createMovieDTO
     * @return Movie
     */
    public function createMovie(CreateMovieDTO $createMovieDTO): Movie
    {
        return $this->createMovieUseCase->execute($createMovieDTO);
    }

    /**
     * Atualiza um filme
     *
     * @param int $movieId
     * @param UpdateMovieDTO $updateMovieDTO
     * @param int|null $userId
     * @return Movie
     */
    public function updateMovie(int $movieId, UpdateMovieDTO $updateMovieDTO, ?int $userId = null): Movie
    {
        return $this->updateMovieUseCase->execute($movieId, $updateMovieDTO, $userId);
    }

    /**
     * Deleta um filme
     *
     * @param int $movieId
     * @param int|null $userId
     * @return bool
     */
    public function deleteMovie(int $movieId, ?int $userId = null): bool
    {
        return $this->deleteMovieUseCase->execute($movieId, $userId);
    }

    /**
     * Busca um filme por ID
     *
     * @param int $movieId
     * @param int|null $userId
     * @return Movie
     */
    public function getMovieById(int $movieId, ?int $userId = null): Movie
    {
        return $this->getMovieByIdUseCase->execute($movieId, $userId);
    }

    /**
     * Busca todos os filmes (com paginação)
     *
     * @param int $perPage
     * @return LengthAwarePaginator|Movie[]
     */
    public function getAllMovies(int $perPage = 15): LengthAwarePaginator
    {
        return $this->getAllMoviesUseCase->execute($perPage);
    }

    /**
     * Busca filmes de um usuário específico (com paginação)
     *
     * @param int $userId
     * @param int $perPage
     * @return LengthAwarePaginator|Movie[]
     */
    public function getUserMovies(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->getUserMoviesUseCase->execute($userId, $perPage);
    }
} 