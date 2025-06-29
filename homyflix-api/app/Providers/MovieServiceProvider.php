<?php

namespace App\Providers;

use App\Application\Movie\Services\MovieApplicationService;
use App\Application\Movie\UseCases\CreateMovieUseCase;
use App\Application\Movie\UseCases\DeleteMovieUseCase;
use App\Application\Movie\UseCases\GetAllMoviesUseCase;
use App\Application\Movie\UseCases\GetMovieByIdUseCase;
use App\Application\Movie\UseCases\GetUserMoviesUseCase;
use App\Application\Movie\UseCases\UpdateMovieUseCase;
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
        // Repository binding
        $this->app->bind(
            MovieRepositoryInterface::class,
            EloquentMovieRepository::class
        );

        // Use Cases registration
        $this->app->singleton(CreateMovieUseCase::class);
        $this->app->singleton(UpdateMovieUseCase::class);
        $this->app->singleton(DeleteMovieUseCase::class);
        $this->app->singleton(GetMovieByIdUseCase::class);
        $this->app->singleton(GetAllMoviesUseCase::class);
        $this->app->singleton(GetUserMoviesUseCase::class);

        // Application Service registration
        $this->app->singleton(MovieApplicationService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
