<?php

namespace App\Providers;

use App\Domain\Auth\Contracts\AuthRepositoryInterface;
use App\Infrastructure\Auth\AuthRepository;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            AuthRepositoryInterface::class,
            AuthRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}
