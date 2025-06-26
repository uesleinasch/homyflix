<?php

namespace App\Application\User\UseCases;

use App\Application\User\DTOs\CreateUserDTO;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Models\User;

class RegisterUserUseCase
{
    public function __construct(private readonly UserRepositoryInterface $userRepository)
    {
    }

    public function execute(CreateUserDTO $createUserDTO): User
    {
        return $this->userRepository->create([
            'name' => $createUserDTO->name,
            'email' => $createUserDTO->email,
            'password' => $createUserDTO->password,
        ]);
    }
}
