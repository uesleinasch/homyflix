<?php

namespace App\Domain\Movie\Contracts;

use App\Models\Movie;
use Illuminate\Database\Eloquent\Collection;

interface MovieRepositoryInterface
{
    /**
     * @return Collection|Movie[]
     */
    public function findAll(): Collection;

    public function findById(int $id): ?Movie;

    public function create(array $data): Movie;

    public function update(int $id, array $data): ?Movie;

    public function delete(int $id): bool;
}
