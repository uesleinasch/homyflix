<?php

namespace App\Infrastructure\Movie\Repositories;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Models\Movie;
use Illuminate\Database\Eloquent\Collection;

class EloquentMovieRepository implements MovieRepositoryInterface
{
    /**
     * @return Collection|Movie[]
     */
    public function findAll(): Collection
    {
        return Movie::all();
    }

    public function findById(int $id): ?Movie
    {
        return Movie::find($id);
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
            return $movie;
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
