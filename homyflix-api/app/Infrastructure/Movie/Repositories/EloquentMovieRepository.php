<?php

namespace App\Infrastructure\Movie\Repositories;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Models\Movie;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentMovieRepository implements MovieRepositoryInterface
{
    /**
     * @return LengthAwarePaginator|Movie[]
     */
    public function findAll(int $perPage = 15): LengthAwarePaginator
    {
        return Movie::with(['user'])->paginate($perPage);
    }

    /**
     * @return LengthAwarePaginator|Movie[]
     */
    public function findAllByUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Movie::with(['user'])
            ->where('user_id', $userId)
            ->paginate($perPage);
    }

    public function findById(int $id): ?Movie
    {
        return Movie::with(['user'])->find($id);
    }

    public function findByIdAndUser(int $id, int $userId): ?Movie
    {
        return Movie::with(['user'])
            ->where('id', $id)
            ->where('user_id', $userId)
            ->first();
    }

    public function create(array $data): Movie
    {
        return Movie::create($data);
    }

    public function update(int $id, array $data): ?Movie
    {
        $movie = $this->findById($id);
        if ($movie) {
            $movie->update($data);
            return $movie->fresh(['user']);
        }
        return null;
    }

    public function delete(int $id): bool
    {
        $movie = $this->findById($id);
        if ($movie) {
            return $movie->delete();
        }
        return false;
    }
}
