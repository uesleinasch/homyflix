<?php

namespace App\Domain\User\Contracts;

use App\Models\User;

interface UserRepositoryInterface
{
    public function create(array $data): User;
}
