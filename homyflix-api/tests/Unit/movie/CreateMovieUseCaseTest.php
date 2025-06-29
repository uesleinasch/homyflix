<?php

namespace Tests\Unit\Movie;

use Tests\TestCase;
use App\Application\Movie\UseCases\CreateMovieUseCase;
use App\Application\Movie\DTOs\CreateMovieDTO;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Domain\Movie\Exceptions\MovieCreationException;
use App\Models\Movie;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Mockery;
use Mockery\MockInterface;

class CreateMovieUseCaseTest extends TestCase
{
    private CreateMovieUseCase $createMovieUseCase;
    private MockInterface $movieRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->movieRepositoryMock = Mockery::mock(MovieRepositoryInterface::class);
        $this->createMovieUseCase = new CreateMovieUseCase($this->movieRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_creates_movie_successfully(): void
    {
        // Arrange
        $createMovieDTO = new CreateMovieDTO(
            title: 'Test Movie',
            release_year: 2023,
            genre: 'Action',
            synopsis: 'A great test movie',
            poster_url: 'https://example.com/poster.jpg',
            user_id: 1
        );

        $expectedMovie = new Movie([
            'id' => 1,
            'title' => 'Test Movie',
            'release_year' => 2023,
            'genre' => 'Action',
            'synopsis' => 'A great test movie',
            'poster_url' => 'https://example.com/poster.jpg',
            'user_id' => 1
        ]);

        DB::shouldReceive('transaction')
            ->once()
            ->andReturnUsing(function ($callback) {
                return $callback();
            });

        Log::shouldReceive('info')
            ->once()
            ->with('Filme criado com sucesso', Mockery::type('array'));

        $this->movieRepositoryMock
            ->shouldReceive('create')
            ->once()
            ->with([
                'title' => 'Test Movie',
                'release_year' => 2023,
                'genre' => 'Action',
                'synopsis' => 'A great test movie',
                'poster_url' => 'https://example.com/poster.jpg',
                'user_id' => 1
            ])
            ->andReturn($expectedMovie);

        // Act
        $result = $this->createMovieUseCase->execute($createMovieDTO);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('Test Movie', $result->title);
        $this->assertEquals(2023, $result->release_year);
        $this->assertEquals(1, $result->user_id);
    }

    public function test_execute_calls_repository_create_with_correct_parameters(): void
    {
        // Arrange
        $createMovieDTO = new CreateMovieDTO(
            title: 'Another Movie',
            release_year: 2024,
            genre: 'Drama',
            synopsis: 'Another test synopsis',
            poster_url: null,
            user_id: 2
        );

        $mockMovie = new Movie(['id' => 2, 'title' => 'Another Movie', 'user_id' => 2]);

        DB::shouldReceive('transaction')
            ->once()
            ->andReturnUsing(function ($callback) {
                return $callback();
            });

        Log::shouldReceive('info')->once();

        $this->movieRepositoryMock
            ->shouldReceive('create')
            ->once()
            ->with([
                'title' => 'Another Movie',
                'release_year' => 2024,
                'genre' => 'Drama',
                'synopsis' => 'Another test synopsis',
                'poster_url' => null,
                'user_id' => 2
            ])
            ->andReturn($mockMovie);

        // Act
        $this->createMovieUseCase->execute($createMovieDTO);

        // Assert
        $this->movieRepositoryMock->shouldHaveReceived('create')->once();
    }

    public function test_execute_throws_movie_creation_exception_on_failure(): void
    {
        // Arrange
        $createMovieDTO = new CreateMovieDTO(
            title: 'Failed Movie',
            release_year: 2023,
            genre: 'Horror',
            synopsis: 'This will fail',
            poster_url: null,
            user_id: 3
        );

        $originalException = new Exception('Database error');

        DB::shouldReceive('transaction')
            ->once()
            ->andReturnUsing(function ($callback) use ($originalException) {
                throw $originalException;
            });

        Log::shouldReceive('error')
            ->once()
            ->with('Erro ao criar filme', Mockery::type('array'));

        // Act & Assert
        $this->expectException(MovieCreationException::class);
        $this->expectExceptionMessage('Não foi possível criar');
        $this->expectExceptionCode(500);
        $this->createMovieUseCase->execute($createMovieDTO);
    }
} 