<?php

namespace App\Domain\Movie\Contracts;

use App\Models\Movie;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MovieRepositoryInterface
{
    /**
     * @return LengthAwarePaginator|Movie[]
     */
    public function findAll(int $perPage = 15): LengthAwarePaginator;

    /**
     * @return LengthAwarePaginator|Movie[]
     */
    public function findAllByUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Movie;

    public function findByIdAndUser(int $id, int $userId): ?Movie;

    public function create(array $data): Movie;

    public function update(int $id, array $data): ?Movie;

    public function delete(int $id): bool;
}
