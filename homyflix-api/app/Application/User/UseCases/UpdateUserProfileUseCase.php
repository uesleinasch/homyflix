<?php

namespace App\Application\User\UseCases;

use App\Application\User\DTOs\UpdateUserDTO;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Models\User;

class UpdateUserProfileUseCase
{
    public function __construct(private readonly UserRepositoryInterface $userRepository)
    {
    }

    public function execute(int $userId, UpdateUserDTO $updateUserDTO): User
    {
        $updateData = [];

        // Apenas incluir campos que foram fornecidos
        if ($updateUserDTO->name !== null) {
            $updateData['name'] = $updateUserDTO->name;
        }

        if ($updateUserDTO->email !== null) {
            $updateData['email'] = $updateUserDTO->email;
        }

        if ($updateUserDTO->password !== null) {
            $updateData['password'] = $updateUserDTO->password;
        }

        return $this->userRepository->update($userId, $updateData);
    }
} 