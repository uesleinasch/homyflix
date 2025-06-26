<?php

namespace App\Application\Auth\UseCases;

use App\Application\Auth\DTOs\AuthCredentialsDTO;
use App\Domain\Auth\Contracts\AuthRepositoryInterface;
use Illuminate\Validation\ValidationException;

class LoginUserUseCase
{
    public function __construct(private readonly AuthRepositoryInterface $authRepository)
    {
    }

    public function execute(AuthCredentialsDTO $credentialsDTO): string
    {
        $token = $this->authRepository->attempt([
            'email' => $credentialsDTO->email,
            'password' => $credentialsDTO->password,
        ]);

        if (!$token) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        return $token;
    }
}
