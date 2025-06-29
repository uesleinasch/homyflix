<?php

namespace Tests\Unit\Movie;

use Tests\TestCase;
use App\Application\Movie\UseCases\DeleteMovieUseCase;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Models\Movie;
use Illuminate\Support\Facades\Log;
use Mockery;
use Mockery\MockInterface;

class DeleteMovieUseCaseTest extends TestCase
{
    private DeleteMovieUseCase $deleteMovieUseCase;
    private MockInterface $movieRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->movieRepositoryMock = Mockery::mock(MovieRepositoryInterface::class);
        $this->deleteMovieUseCase = new DeleteMovieUseCase($this->movieRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_deletes_movie_successfully(): void
    {
        // Arrange
        $movieId = 1;
        $existingMovie = new Movie();
        $existingMovie->id = 1;
        $existingMovie->title = 'Movie to Delete';
        $existingMovie->user_id = 1;

        Log::shouldReceive('info')
            ->once()
            ->with('Filme deletado com sucesso', Mockery::type('array'));

        $this->movieRepositoryMock
            ->shouldReceive('findById')
            ->once()
            ->with($movieId)
            ->andReturn($existingMovie);

        $this->movieRepositoryMock
            ->shouldReceive('delete')
            ->once()
            ->with($movieId)
            ->andReturn(true);

        // Act
        $result = $this->deleteMovieUseCase->execute($movieId);

        // Assert
        $this->assertTrue($result);
    }

    public function test_execute_deletes_movie_successfully_with_user_id(): void
    {
        // Arrange
        $movieId = 2;
        $userId = 1;
        $existingMovie = new Movie();
        $existingMovie->id = 2;
        $existingMovie->title = 'User Movie to Delete';
        $existingMovie->user_id = 1;

        Log::shouldReceive('info')
            ->once()
            ->with('Filme deletado com sucesso', Mockery::type('array'));

        $this->movieRepositoryMock
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn($existingMovie);

        $this->movieRepositoryMock
            ->shouldReceive('delete')
            ->once()
            ->with($movieId)
            ->andReturn(true);

        // Act
        $result = $this->deleteMovieUseCase->execute($movieId, $userId);

        // Assert
        $this->assertTrue($result);
        $this->movieRepositoryMock->shouldHaveReceived('findByIdAndUser')->once();
        $this->movieRepositoryMock->shouldHaveReceived('delete')->once();
    }

    public function test_execute_throws_movie_not_found_exception_when_movie_not_exists(): void
    {
        // Arrange
        $movieId = 999;
        $userId = 1;

        $this->movieRepositoryMock
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn(null);

        // Act & Assert
        $this->expectException(MovieNotFoundException::class);
        $this->expectExceptionMessage('Filme não encontrado ou você não tem permissão para excluí-lo.');
        $this->expectExceptionCode(404);

        $this->deleteMovieUseCase->execute($movieId, $userId);
    }
} 