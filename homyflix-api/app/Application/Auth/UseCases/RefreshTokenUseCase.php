<?php

namespace App\Application\Auth\UseCases;

use App\Domain\Auth\Contracts\AuthRepositoryInterface;

class RefreshTokenUseCase
{
    public function __construct(private readonly AuthRepositoryInterface $authRepository)
    {
    }

    public function execute(): string
    {
        return $this->authRepository->refresh();
    }
}
