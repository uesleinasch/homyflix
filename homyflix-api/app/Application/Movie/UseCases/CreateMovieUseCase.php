<?php

namespace App\Application\Movie\UseCases;

use App\Application\Movie\DTOs\CreateMovieDTO;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieCreationException;
use App\Models\Movie;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateMovieUseCase
{
    public function __construct(
        private readonly MovieRepositoryInterface $movieRepository
    ) {}

    /**
     * Executa o caso de uso para criar um novo filme
     *
     * @param CreateMovieDTO $createMovieDTO
     * @return Movie
     * @throws MovieCreationException
     */
    public function execute(CreateMovieDTO $createMovieDTO): Movie
    {
        try {
            return DB::transaction(function () use ($createMovieDTO) {
                $movieData = $createMovieDTO->toArray();
                
                $movie = $this->movieRepository->create($movieData);
                
                Log::info('Filme criado com sucesso', [
                    'movie_id' => $movie->id,
                    'user_id' => $createMovieDTO->user_id,
                    'title' => $movie->title,
                    'timestamp' => now()
                ]);
                
                return $movie;
            });
        } catch (Exception $e) {
            Log::error('Erro ao criar filme', [
                'error' => $e->getMessage(),
                'user_id' => $createMovieDTO->user_id,
                'title' => $createMovieDTO->title,
                'trace' => $e->getTraceAsString()
            ]);
            
            throw new MovieCreationException(
                'Não foi possível criar o filme. Tente novamente.',
                500,
                $e
            );
        }
    }
} 