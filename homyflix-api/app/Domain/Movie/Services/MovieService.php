<?php

namespace App\Domain\Movie\Services;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieCreationException;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Domain\Movie\Exceptions\MovieUpdateException;
use App\Models\Movie;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MovieService
{
    public function __construct(private readonly MovieRepositoryInterface $movieRepository)
    {
    }

    /**
     * @return Collection|Movie[]
     */
    public function getAllMovies(): Collection
    {
        return $this->movieRepository->findAll();
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
     * @throws MovieCreationException
     */
    public function createMovie(array $data): Movie
    {
        try {
            return DB::transaction(function () use ($data) {
                $movie = $this->movieRepository->create($data);
                Log::info('Filme criado com sucesso.', ['movie_id' => $movie->id]);
                return $movie;
            });
        } catch (Exception $e) {
            Log::error('Erro ao criar filme.', [
                'error' => $e->getMessage(),
                'data' => $data,
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
                $this->movieRepository->update($id, $data);
                Log::info('Filme atualizado com sucesso.', ['movie_id' => $id]);
                return $movie->fresh();
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
     * @throws MovieNotFoundException
     */
    public function deleteMovie(int $id): bool
    {
        $movie = $this->getMovieById($id);
        Log::info('Filme deletado com sucesso.', ['movie_id' => $id]);
        return $this->movieRepository->delete($id);
    }
}
