<?php

use App\Interface\Http\Controllers\Api\AuthController;
use App\Interface\Http\Controllers\Api\MovieController;
use App\Interface\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);

    Route::middleware('auth.jwt')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});

Route::middleware('auth.jwt')->group(function () {
    Route::apiResource('movies', MovieController::class);
    
    // Rotas de perfil do usuário
    Route::get('user/profile', [UserController::class, 'profile']);
    Route::patch('user/profile', [UserController::class, 'updateProfile']);
});
