<?php

namespace Tests\Unit\Movie;

use Tests\TestCase;
use App\Application\Movie\UseCases\GetUserMoviesUseCase;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Models\Movie;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Mockery;
use Mockery\MockInterface;

class GetUserMoviesUseCaseTest extends TestCase
{
    private GetUserMoviesUseCase $getUserMoviesUseCase;
    private MockInterface $movieRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->movieRepositoryMock = Mockery::mock(MovieRepositoryInterface::class);
        $this->getUserMoviesUseCase = new GetUserMoviesUseCase($this->movieRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_returns_user_movies_successfully(): void
    {
        // Arrange
        $userId = 1;
        $perPage = 15;
        $mockPaginator = Mockery::mock(LengthAwarePaginator::class);
        
        $this->movieRepositoryMock
            ->shouldReceive('findAllByUser')
            ->once()
            ->with($userId, $perPage)
            ->andReturn($mockPaginator);

        // Act
        $result = $this->getUserMoviesUseCase->execute($userId, $perPage);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals($mockPaginator, $result);
    }

    public function test_execute_calls_repository_find_all_by_user_with_correct_parameters(): void
    {
        // Arrange
        $userId = 2;
        $perPage = 20;
        $mockPaginator = Mockery::mock(LengthAwarePaginator::class);
        
        $this->movieRepositoryMock
            ->shouldReceive('findAllByUser')
            ->once()
            ->with($userId, $perPage)
            ->andReturn($mockPaginator);

        // Act
        $this->getUserMoviesUseCase->execute($userId, $perPage);

        // Assert
        $this->movieRepositoryMock->shouldHaveReceived('findAllByUser')->once();
    }

    public function test_execute_uses_default_per_page_when_not_provided(): void
    {
        // Arrange
        $userId = 3;
        $defaultPerPage = 15;
        $mockPaginator = Mockery::mock(LengthAwarePaginator::class);
        
        $this->movieRepositoryMock
            ->shouldReceive('findAllByUser')
            ->once()
            ->with($userId, $defaultPerPage)
            ->andReturn($mockPaginator);

        // Act
        $result = $this->getUserMoviesUseCase->execute($userId);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->movieRepositoryMock->shouldHaveReceived('findAllByUser')->with($userId, $defaultPerPage);
    }
} 