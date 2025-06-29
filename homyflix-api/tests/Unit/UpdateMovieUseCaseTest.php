<?php

namespace Tests\Unit;

use App\Application\Movie\DTOs\UpdateMovieDTO;
use App\Application\Movie\UseCases\UpdateMovieUseCase;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieNotFoundException;
use App\Domain\Movie\Exceptions\MovieUpdateException;
use App\Models\Movie;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class UpdateMovieUseCaseTest extends TestCase
{
    use RefreshDatabase;

    private UpdateMovieUseCase $updateMovieUseCase;
    private MovieRepositoryInterface $mockMovieRepository;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->mockMovieRepository = Mockery::mock(MovieRepositoryInterface::class);
        $this->updateMovieUseCase = new UpdateMovieUseCase($this->mockMovieRepository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_can_update_movie_successfully(): void
    {
        // Arrange
        $movieId = 1;
        $userId = 1;
        
        $updateMovieDTO = new UpdateMovieDTO(
            title: 'Updated Movie Title',
            genre: 'Updated Genre'
        );

        $existingMovie = new Movie([
            'id' => $movieId,
            'title' => 'Original Title',
            'release_year' => 2023,
            'genre' => 'Original Genre',
            'synopsis' => 'Original synopsis',
            'user_id' => $userId
        ]);

        $updatedMovie = new Movie([
            'id' => $movieId,
            'title' => 'Updated Movie Title',
            'release_year' => 2023,
            'genre' => 'Updated Genre',
            'synopsis' => 'Original synopsis',
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
            ->with($movieId, $updateMovieDTO->toArray())
            ->andReturn($updatedMovie);

        // Act
        $result = $this->updateMovieUseCase->execute($movieId, $updateMovieDTO, $userId);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('Updated Movie Title', $result->title);
        $this->assertEquals('Updated Genre', $result->genre);
        $this->assertEquals($userId, $result->user_id);
    }

    /** @test */
    public function it_throws_movie_not_found_exception_when_user_movie_not_exists(): void
    {
        // Arrange
        $movieId = 999;
        $userId = 1;
        
        $updateMovieDTO = new UpdateMovieDTO(title: 'Updated Title');

        $this->mockMovieRepository
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn(null);

        // Assert
        $this->expectException(MovieNotFoundException::class);
        $this->expectExceptionMessage('Filme não encontrado ou você não tem permissão para editá-lo.');

        // Act
        $this->updateMovieUseCase->execute($movieId, $updateMovieDTO, $userId);
    }

    /** @test */
    public function it_can_update_movie_without_user_restriction(): void
    {
        // Arrange
        $movieId = 1;
        
        $updateMovieDTO = new UpdateMovieDTO(title: 'Updated Title');

        $existingMovie = new Movie([
            'id' => $movieId,
            'title' => 'Original Title',
            'user_id' => 1
        ]);

        $updatedMovie = new Movie([
            'id' => $movieId,
            'title' => 'Updated Title',
            'user_id' => 1
        ]);

        $this->mockMovieRepository
            ->shouldReceive('findById')
            ->once()
            ->with($movieId)
            ->andReturn($existingMovie);

        $this->mockMovieRepository
            ->shouldReceive('update')
            ->once()
            ->with($movieId, $updateMovieDTO->toArray())
            ->andReturn($updatedMovie);

        // Act
        $result = $this->updateMovieUseCase->execute($movieId, $updateMovieDTO);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('Updated Title', $result->title);
    }

    /** @test */
    public function it_returns_existing_movie_when_no_update_data_provided(): void
    {
        // Arrange
        $movieId = 1;
        $userId = 1;
        
        $updateMovieDTO = new UpdateMovieDTO(); // Empty DTO

        $existingMovie = new Movie([
            'id' => $movieId,
            'title' => 'Original Title',
            'user_id' => $userId
        ]);

        $this->mockMovieRepository
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->with($movieId, $userId)
            ->andReturn($existingMovie);

        // Should not call update since no data to update
        $this->mockMovieRepository
            ->shouldNotReceive('update');

        // Act
        $result = $this->updateMovieUseCase->execute($movieId, $updateMovieDTO, $userId);

        // Assert
        $this->assertSame($existingMovie, $result);
    }

    /** @test */
    public function it_throws_movie_update_exception_when_repository_fails(): void
    {
        // Arrange
        $movieId = 1;
        $userId = 1;
        
        $updateMovieDTO = new UpdateMovieDTO(title: 'Updated Title');

        $existingMovie = new Movie([
            'id' => $movieId,
            'title' => 'Original Title',
            'user_id' => $userId
        ]);

        $this->mockMovieRepository
            ->shouldReceive('findByIdAndUser')
            ->once()
            ->andReturn($existingMovie);

        $this->mockMovieRepository
            ->shouldReceive('update')
            ->once()
            ->andThrow(new Exception('Database error'));

        // Assert
        $this->expectException(MovieUpdateException::class);
        $this->expectExceptionMessage('Não foi possível atualizar o filme. Tente novamente.');

        // Act
        $this->updateMovieUseCase->execute($movieId, $updateMovieDTO, $userId);
    }
} 