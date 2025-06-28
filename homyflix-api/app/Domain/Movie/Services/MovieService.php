<?php

namespace App\Domain\Movie\Services;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieCreationException;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Domain\Movie\Exceptions\MovieUpdateException;
use App\Models\Movie;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MovieService
{
    public function __construct(private readonly MovieRepositoryInterface $movieRepository)
    {
    }

    /**
     * @return LengthAwarePaginator|Movie[]
     */
    public function getAllMovies(int $perPage = 15): LengthAwarePaginator
    {
        return $this->movieRepository->findAll($perPage);
    }

    /**
     * @return LengthAwarePaginator|Movie[]
     */
    public function getUserMovies(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->movieRepository->findAllByUser($userId, $perPage);
    }

    /**
     * @throws MovieNotFoundException
     */
    public function getMovieById(int $id): ?Movie
    {
        $movie = $this->movieRepository->findById($id);
        if (!$movie) {
            throw new MovieNotFoundException();
        }
        return $movie;
    }

    /**
     * @throws MovieNotFoundException
     */
    public function getUserMovieById(int $id, int $userId): ?Movie
    {
        $movie = $this->movieRepository->findByIdAndUser($id, $userId);
        if (!$movie) {
            throw new MovieNotFoundException();
        }
        return $movie;
    }

    /**
     * @throws MovieCreationException
     */
    public function createMovie(array $data): Movie
    {
        try {
            return DB::transaction(function () use ($data) {
                $movie = $this->movieRepository->create($data);
                Log::info('Filme criado com sucesso.', [
                    'movie_id' => $movie->id,
                    'user_id' => $data['user_id'] ?? null,
                    'title' => $movie->title
                ]);
                return $movie;
            });
        } catch (Exception $e) {
            Log::error('Erro ao criar filme.', [
                'error' => $e->getMessage(),
                'data' => $data,
                'user_id' => $data['user_id'] ?? null,
            ]);
            throw new MovieCreationException('Não foi possível criar o filme.', 500, $e);
        }
    }

    /**
     * @throws MovieUpdateException
     * @throws MovieNotFoundException
     */
    public function updateMovie(int $id, array $data): ?Movie
    {
        try {
            return DB::transaction(function () use ($id, $data) {
                $movie = $this->getMovieById($id);
                $updatedMovie = $this->movieRepository->update($id, $data);
                Log::info('Filme atualizado com sucesso.', [
                    'movie_id' => $id,
                    'user_id' => $movie->user_id,
                    'title' => $updatedMovie->title ?? $movie->title
                ]);
                return $updatedMovie;
            });
        } catch (MovieNotFoundException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('Erro ao atualizar o filme.', [
                'error' => $e->getMessage(),
                'movie_id' => $id,
                'data' => $data,
            ]);
            throw new MovieUpdateException('Não foi possível atualizar o filme.', 500, $e);
        }
    }

    /**
     * @throws MovieUpdateException
     * @throws MovieNotFoundException
     */
    public function updateUserMovie(int $id, int $userId, array $data): ?Movie
    {
        try {
            return DB::transaction(function () use ($id, $userId, $data) {
                $movie = $this->getUserMovieById($id, $userId);
                $updatedMovie = $this->movieRepository->update($id, $data);
                Log::info('Filme do usuário atualizado com sucesso.', [
                    'movie_id' => $id,
                    'user_id' => $userId,
                    'title' => $updatedMovie->title ?? $movie->title
                ]);
                return $updatedMovie;
            });
        } catch (MovieNotFoundException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('Erro ao atualizar filme do usuário.', [
                'error' => $e->getMessage(),
                'movie_id' => $id,
                'user_id' => $userId,
                'data' => $data,
            ]);
            throw new MovieUpdateException('Não foi possível atualizar o filme.', 500, $e);
        }
    }

    /**
     * @throws MovieNotFoundException
     */
    public function deleteMovie(int $id): bool
    {
        $movie = $this->getMovieById($id);
        Log::info('Filme deletado com sucesso.', [
            'movie_id' => $id,
            'user_id' => $movie->user_id,
            'title' => $movie->title
        ]);
        return $this->movieRepository->delete($id);
    }

    /**
     * @throws MovieNotFoundException
     */
    public function deleteUserMovie(int $id, int $userId): bool
    {
        $movie = $this->getUserMovieById($id, $userId);
        Log::info('Filme do usuário deletado com sucesso.', [
            'movie_id' => $id,
            'user_id' => $userId,
            'title' => $movie->title
        ]);
        return $this->movieRepository->delete($id);
    }
}
