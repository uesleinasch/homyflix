<?php

namespace App\Domain\Auth\Contracts;

interface AuthRepositoryInterface
{
    public function attempt(array $credentials): string|false;
    public function logout(): void;
}
