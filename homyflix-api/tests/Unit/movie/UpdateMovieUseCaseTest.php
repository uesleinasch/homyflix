<?php

namespace Tests\Unit\Movie;

use Tests\TestCase;
use App\Application\Movie\UseCases\UpdateMovieUseCase;
use App\Application\Movie\DTOs\UpdateMovieDTO;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Domain\Movie\Exceptions\MovieUpdateException;
use App\Models\Movie;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Mockery;
use Mockery\MockInterface;

class UpdateMovieUseCaseTest extends TestCase
{
    private UpdateMovieUseCase $updateMovieUseCase;
    private MockInterface $movieRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->movieRepositoryMock = Mockery::mock(MovieRepositoryInterface::class);
        $this->updateMovieUseCase = new UpdateMovieUseCase($this->movieRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_updates_movie_successfully(): void
    {
        // Arrange
        $movieId = 1;
        $updateMovieDTO = new UpdateMovieDTO(
            title: 'Updated Movie Title',
            release_year: 2024,
            genre: 'Updated Genre'
        );

        $existingMovie = new Movie();
        $existingMovie->id = 1;
        $existingMovie->title = 'Original Title';
        $existingMovie->user_id = 1;

        $updatedMovie = new Movie();
        $updatedMovie->id = 1;
        $updatedMovie->title = 'Updated Movie Title';
        $updatedMovie->release_year = 2024;
        $updatedMovie->genre = 'Updated Genre';
        $updatedMovie->user_id = 1;

        DB::shouldReceive('transaction')
            ->once()
            ->andReturnUsing(function ($callback) {
                return $callback();
            });

        Log::shouldReceive('info')
            ->once()
            ->with('Filme atualizado com sucesso', Mockery::type('array'));

        $this->movieRepositoryMock
            ->shouldReceive('findById')
            ->once()
            ->with($movieId)
            ->andReturn($existingMovie);

        $this->movieRepositoryMock
            ->shouldReceive('update')
            ->once()
            ->with($movieId, [
                'title' => 'Updated Movie Title',
                'release_year' => 2024,
                'genre' => 'Updated Genre'
            ])
            ->andReturn($updatedMovie);

        // Act
        $result = $this->updateMovieUseCase->execute($movieId, $updateMovieDTO);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('Updated Movie Title', $result->title);
        $this->assertEquals(2024, $result->release_year);
        $this->assertEquals('Updated Genre', $result->genre);
    }

    public function test_execute_throws_movie_not_found_exception_when_movie_not_exists(): void
    {
        // Arrange
        $movieId = 999;
        $userId = 1;
        $updateMovieDTO = new UpdateMovieDTO(title: 'New Title');

        DB::shouldReceive('transaction')
            ->once()
            ->andReturnUsing(function ($callback) {
                return $callback();
            });

        $this->movieRepositoryMock
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn(null);

        // Act & Assert
        $this->expectException(MovieNotFoundException::class);
        $this->expectExceptionMessage('Filme não encontrado ou você não tem permissão para editá-lo.');
        $this->expectExceptionCode(404);

        $this->updateMovieUseCase->execute($movieId, $updateMovieDTO, $userId);
    }

    public function test_execute_throws_movie_update_exception_on_failure(): void
    {
        // Arrange
        $movieId = 1;
        $updateMovieDTO = new UpdateMovieDTO(title: 'Failed Update');

        $existingMovie = new Movie();
        $existingMovie->id = 1;
        $existingMovie->user_id = 1;

        $originalException = new Exception('Database error');

        DB::shouldReceive('transaction')
            ->once()
            ->andReturnUsing(function ($callback) use ($originalException) {
                throw $originalException;
            });

        Log::shouldReceive('error')
            ->once()
            ->with('Erro ao atualizar filme', Mockery::type('array'));

        // Act & Assert
        $this->expectException(MovieUpdateException::class);
        $this->expectExceptionMessage('Não foi possível atualizar o filme. Tente novamente.');
        $this->expectExceptionCode(500);

        $this->updateMovieUseCase->execute($movieId, $updateMovieDTO);
    }
} 