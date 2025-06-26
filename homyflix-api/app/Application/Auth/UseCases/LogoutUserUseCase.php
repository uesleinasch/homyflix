<?php

namespace App\Application\Auth\UseCases;

use App\Domain\Auth\Contracts\AuthRepositoryInterface;

class LogoutUserUseCase
{
    public function __construct(private readonly AuthRepositoryInterface $authRepository)
    {
    }

    public function execute(): void
    {
        $this->authRepository->logout();
    }
}
