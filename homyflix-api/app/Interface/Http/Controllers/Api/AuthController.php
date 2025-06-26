<?php

namespace App\Interface\Http\Controllers\Api;

use App\Application\Auth\DTOs\AuthCredentialsDTO;
use App\Application\Auth\UseCases\LoginUserUseCase;
use App\Interface\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct(private readonly LoginUserUseCase $loginUserUseCase)
    {
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
}
