<?php

namespace App\Domain\User\Contracts;

use App\Models\User;

interface UserRepositoryInterface
{
    public function create(array $data): User;
    public function update(int $id, array $data): User;
    public function findById(int $id): ?User;
}
