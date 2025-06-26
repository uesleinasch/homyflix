<?php

namespace App\Interface\Http\Controllers\Api;

use App\Application\Auth\DTOs\AuthCredentialsDTO;
use App\Application\Auth\UseCases\LoginUserUseCase;
use App\Application\Auth\UseCases\LogoutUserUseCase;
use App\Application\User\DTOs\CreateUserDTO;
use App\Application\User\UseCases\RegisterUserUseCase;
use App\Interface\Http\Requests\LoginRequest;
use App\Interface\Http\Requests\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct(
        private readonly LoginUserUseCase $loginUserUseCase,
        private readonly RegisterUserUseCase $registerUserUseCase,
        private readonly LogoutUserUseCase $logoutUserUseCase
    ) {
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentialsDTO = AuthCredentialsDTO::fromRequest($request->validated());

        $token = $this->loginUserUseCase->execute($credentialsDTO);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ]);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $userDTO = CreateUserDTO::fromRequest($request->validated());

        $user = $this->registerUserUseCase->execute($userDTO);

        return response()->json($user, 201);
    }

    public function logout(): JsonResponse
    {
        $this->logoutUserUseCase->execute();

        return response()->json(['message' => 'Successfully logged out']);
    }
}
