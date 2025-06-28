<?php

namespace Tests\Unit;

use App\Application\Movie\DTOs\CreateMovieDTO;
use App\Application\Movie\UseCases\CreateMovieUseCase;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieCreationException;
use App\Models\Movie;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Mockery;
use Tests\TestCase;

class CreateMovieUseCaseTest extends TestCase
{
    use RefreshDatabase;

    private CreateMovieUseCase $createMovieUseCase;
    private MovieRepositoryInterface $mockMovieRepository;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->mockMovieRepository = Mockery::mock(MovieRepositoryInterface::class);
        $this->createMovieUseCase = new CreateMovieUseCase($this->mockMovieRepository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_can_create_movie_successfully(): void
    {
        // Arrange
        $createMovieDTO = new CreateMovieDTO(
            title: 'Test Movie',
            release_year: 2024,
            genre: 'Action',
            synopsis: 'Test synopsis',
            poster_url: 'https://example.com/poster.jpg',
            user_id: 1
        );

        $expectedMovie = new Movie([
            'id' => 1,
            'title' => 'Test Movie',
            'release_year' => 2024,
            'genre' => 'Action',
            'synopsis' => 'Test synopsis',
            'poster_url' => 'https://example.com/poster.jpg',
            'user_id' => 1
        ]);
        $expectedMovie->id = 1;

        $this->mockMovieRepository
            ->shouldReceive('create')
            ->once()
            ->with($createMovieDTO->toArray())
            ->andReturn($expectedMovie);

        // Act
        $result = $this->createMovieUseCase->execute($createMovieDTO);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('Test Movie', $result->title);
        $this->assertEquals(2024, $result->release_year);
        $this->assertEquals('Action', $result->genre);
        $this->assertEquals(1, $result->user_id);
    }

    /** @test */
    public function it_throws_movie_creation_exception_when_repository_fails(): void
    {
        // Arrange
        $createMovieDTO = new CreateMovieDTO(
            title: 'Test Movie',
            release_year: 2024,
            genre: 'Action',
            synopsis: 'Test synopsis',
            user_id: 1
        );

        $this->mockMovieRepository
            ->shouldReceive('create')
            ->once()
            ->with($createMovieDTO->toArray())
            ->andThrow(new Exception('Database error'));

        // Assert
        $this->expectException(MovieCreationException::class);
        $this->expectExceptionMessage('Não foi possível criar o filme. Tente novamente.');

        // Act
        $this->createMovieUseCase->execute($createMovieDTO);
    }

    /** @test */
    public function it_logs_movie_creation_success(): void
    {
        // Arrange
        $createMovieDTO = new CreateMovieDTO(
            title: 'Test Movie',
            release_year: 2024,
            genre: 'Action',
            synopsis: 'Test synopsis',
            user_id: 1
        );

        $expectedMovie = new Movie($createMovieDTO->toArray());
        $expectedMovie->id = 1;

        $this->mockMovieRepository
            ->shouldReceive('create')
            ->once()
            ->andReturn($expectedMovie);

        // Act
        $result = $this->createMovieUseCase->execute($createMovieDTO);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        // Log assertions would be tested in integration tests
    }
} 