<?php

namespace Tests\Unit\Movie;

use Tests\TestCase;
use App\Application\Movie\UseCases\GetAllMoviesUseCase;
use App\Domain\Movie\Contracts\MovieRepositoryInterface;
use App\Models\Movie;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Mockery;
use Mockery\MockInterface;

class GetAllMoviesUseCaseTest extends TestCase
{
    private GetAllMoviesUseCase $getAllMoviesUseCase;
    private MockInterface $movieRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->movieRepositoryMock = Mockery::mock(MovieRepositoryInterface::class);
        $this->getAllMoviesUseCase = new GetAllMoviesUseCase($this->movieRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_returns_paginated_movies_successfully(): void
    {
        // Arrange
        $perPage = 15;
        $mockPaginator = Mockery::mock(LengthAwarePaginator::class);
        
        $this->movieRepositoryMock
            ->shouldReceive('findAll')
            ->once()
            ->with($perPage)
            ->andReturn($mockPaginator);

        // Act
        $result = $this->getAllMoviesUseCase->execute($perPage);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals($mockPaginator, $result);
    }

    public function test_execute_calls_repository_find_all_with_correct_parameters(): void
    {
        // Arrange
        $perPage = 20;
        $mockPaginator = Mockery::mock(LengthAwarePaginator::class);
        
        $this->movieRepositoryMock
            ->shouldReceive('findAll')
            ->once()
            ->with($perPage)
            ->andReturn($mockPaginator);

        // Act
        $this->getAllMoviesUseCase->execute($perPage);

        // Assert
        $this->movieRepositoryMock->shouldHaveReceived('findAll')->once();
    }

    public function test_execute_uses_default_per_page_when_not_provided(): void
    {
        // Arrange
        $defaultPerPage = 15;
        $mockPaginator = Mockery::mock(LengthAwarePaginator::class);
        
        $this->movieRepositoryMock
            ->shouldReceive('findAll')
            ->once()
            ->with($defaultPerPage)
            ->andReturn($mockPaginator);

        // Act
        $result = $this->getAllMoviesUseCase->execute();

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->movieRepositoryMock->shouldHaveReceived('findAll')->with($defaultPerPage);
    }
} 