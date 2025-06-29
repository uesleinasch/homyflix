<?php

namespace Tests\Unit\Movie;

use Tests\TestCase;
use App\Application\Movie\UseCases\GetMovieByIdUseCase;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Models\Movie;
use Mockery;
use Mockery\MockInterface;

class GetMovieByIdUseCaseTest extends TestCase
{
    private GetMovieByIdUseCase $getMovieByIdUseCase;
    private MockInterface $movieRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->movieRepositoryMock = Mockery::mock(MovieRepositoryInterface::class);
        $this->getMovieByIdUseCase = new GetMovieByIdUseCase($this->movieRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_returns_movie_successfully_without_user_id(): void
    {
        // Arrange
        $movieId = 1;
        $expectedMovie = new Movie();
        $expectedMovie->id = 1;
        $expectedMovie->title = 'Test Movie';
        $expectedMovie->release_year = 2023;
        $expectedMovie->genre = 'Action';
        $expectedMovie->synopsis = 'A great test movie';
        $expectedMovie->user_id = 1;

        $this->movieRepositoryMock
            ->shouldReceive('findById')
            ->once()
            ->with($movieId)
            ->andReturn($expectedMovie);

        // Act
        $result = $this->getMovieByIdUseCase->execute($movieId);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('Test Movie', $result->title);
        $this->assertEquals(1, $result->id);
        $this->assertEquals($expectedMovie, $result);
    }

    public function test_execute_returns_movie_successfully_with_user_id(): void
    {
        // Arrange
        $movieId = 2;
        $userId = 1;
        $expectedMovie = new Movie();
        $expectedMovie->id = 2;
        $expectedMovie->title = 'User Movie';
        $expectedMovie->release_year = 2024;
        $expectedMovie->genre = 'Drama';
        $expectedMovie->synopsis = 'A user-specific movie';
        $expectedMovie->user_id = 1;

        $this->movieRepositoryMock
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn($expectedMovie);

        // Act
        $result = $this->getMovieByIdUseCase->execute($movieId, $userId);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('User Movie', $result->title);
        $this->assertEquals(2, $result->id);
        $this->assertEquals(1, $result->user_id);
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
        $this->expectExceptionMessage('Não encontrado carai');
        $this->expectExceptionCode(404);

        $this->getMovieByIdUseCase->execute($movieId, $userId);
    }
} 