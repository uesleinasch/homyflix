<?php

namespace App\Providers;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Infrastructure\Movie\Repositories\EloquentMovieRepository;
use Illuminate\Support\ServiceProvider;

class MovieServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            MovieRepositoryInterface::class,
            EloquentMovieRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
