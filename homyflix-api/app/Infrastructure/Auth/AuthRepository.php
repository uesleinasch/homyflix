<?php

namespace App\Infrastructure\Auth;

use App\Domain\Auth\Contracts\AuthRepositoryInterface;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthRepository implements AuthRepositoryInterface
{
    public function attempt(array $credentials): string|false
    {
        return JWTAuth::attempt($credentials);
    }

    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }
}
