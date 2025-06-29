<?php

namespace Tests\Unit;

use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Domain\Movie\Services\MovieService;
use App\Models\Movie;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use PHPUnit\Framework\TestCase;
use Mockery;

class MovieServiceTest extends TestCase
{
    private MovieService $movieService;
    private MovieRepositoryInterface $mockMovieRepository;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->mockMovieRepository = Mockery::mock(MovieRepositoryInterface::class);
        $this->movieService = new MovieService($this->mockMovieRepository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_can_get_user_movies(): void
    {
        // Arrange
        $userId = 1;
        $perPage = 15;
        
        $mockPaginator = Mockery::mock(LengthAwarePaginator::class);
        
        $this->mockMovieRepository
            ->shouldReceive('findAllByUser')
            ->once()
            ->with($userId, $perPage)
            ->andReturn($mockPaginator);

        // Act
        $result = $this->movieService->getUserMovies($userId, $perPage);

        // Assert
        $this->assertSame($mockPaginator, $result);
    }

    /** @test */
    public function it_can_get_user_movie_by_id(): void
    {
        // Arrange
        $movieId = 1;
        $userId = 1;
        
        $expectedMovie = new Movie([
            'id' => $movieId,
            'title' => 'Test Movie',
            'user_id' => $userId
        ]);

        $this->mockMovieRepository
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn($expectedMovie);

        // Act
        $result = $this->movieService->getUserMovieById($movieId, $userId);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('Test Movie', $result->title);
        $this->assertEquals($userId, $result->user_id);
    }

    /** @test */
    public function it_throws_exception_when_user_movie_not_found(): void
    {
        // Arrange
        $movieId = 999;
        $userId = 1;

        $this->mockMovieRepository
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn(null);

        // Assert
        $this->expectException(MovieNotFoundException::class);

        // Act
        $this->movieService->getUserMovieById($movieId, $userId);
    }

    /** @test */
    public function it_can_create_movie_with_user_id(): void
    {
        // Arrange
        $movieData = [
            'title' => 'New Movie',
            'release_year' => 2024,
            'genre' => 'Action',
            'synopsis' => 'Test synopsis',
            'user_id' => 1
        ];

        $expectedMovie = new Movie($movieData);
        $expectedMovie->id = 1;

        $this->mockMovieRepository
            ->shouldReceive('create')
            ->once()
            ->with($movieData)
            ->andReturn($expectedMovie);

        // Act
        $result = $this->movieService->createMovie($movieData);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('New Movie', $result->title);
        $this->assertEquals(1, $result->user_id);
    }

    /** @test */
    public function it_can_update_user_movie(): void
    {
        // Arrange
        $movieId = 1;
        $userId = 1;
        $updateData = ['title' => 'Updated Movie'];

        $existingMovie = new Movie([
            'id' => $movieId,
            'title' => 'Original Movie',
            'user_id' => $userId
        ]);

        $updatedMovie = new Movie([
            'id' => $movieId,
            'title' => 'Updated Movie',
            'user_id' => $userId
        ]);

        $this->mockMovieRepository
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn($existingMovie);

        $this->mockMovieRepository
            ->shouldReceive('update')
            ->once()
            ->with($movieId, $updateData)
            ->andReturn($updatedMovie);

        // Act
        $result = $this->movieService->updateUserMovie($movieId, $userId, $updateData);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('Updated Movie', $result->title);
    }

    /** @test */
    public function it_can_delete_user_movie(): void
    {
        // Arrange
        $movieId = 1;
        $userId = 1;

        $existingMovie = new Movie([
            'id' => $movieId,
            'title' => 'Movie to Delete',
            'user_id' => $userId
        ]);

        $this->mockMovieRepository
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn($existingMovie);

        $this->mockMovieRepository
            ->shouldReceive('delete')
            ->once()
            ->with($movieId)
            ->andReturn(true);

        // Act
        $result = $this->movieService->deleteUserMovie($movieId, $userId);

        // Assert
        $this->assertTrue($result);
    }
} 