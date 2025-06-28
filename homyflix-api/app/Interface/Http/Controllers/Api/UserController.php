<?php

namespace App\Interface\Http\Controllers\Api;

use App\Application\User\DTOs\UpdateUserDTO;
use App\Application\User\UseCases\UpdateUserProfileUseCase;
use App\Http\Controllers\Controller;
use App\Interface\Http\Requests\UpdateUserRequest;
use App\Interface\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private readonly UpdateUserProfileUseCase $updateUserProfileUseCase
    ) {
    }

    /**
     * Exibir informações do usuário autenticado
     */
    public function profile(): UserResource
    {
        $user = auth()->user();
        return new UserResource($user);
    }

    /**
     * Atualizar perfil do usuário autenticado
     */
    public function updateProfile(UpdateUserRequest $request): UserResource
    {
        $userId = auth()->id();
        $updateUserDTO = UpdateUserDTO::fromRequest($request->validated());
        
        $user = $this->updateUserProfileUseCase->execute($userId, $updateUserDTO);
        
        return new UserResource($user);
    }
} 