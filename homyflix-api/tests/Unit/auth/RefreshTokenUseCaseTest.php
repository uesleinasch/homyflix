<?php

namespace Tests\Unit\Auth;

use Tests\TestCase;
use App\Application\Auth\UseCases\RefreshTokenUseCase;
use App\Domain\Auth\Contracts\AuthRepositoryInterface;
use Mockery;
use Mockery\MockInterface;

class RefreshTokenUseCaseTest extends TestCase
{
    private RefreshTokenUseCase $refreshTokenUseCase;
    private MockInterface $authRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->authRepositoryMock = Mockery::mock(AuthRepositoryInterface::class);
        $this->refreshTokenUseCase = new RefreshTokenUseCase($this->authRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_returns_refreshed_token_successfully(): void
    {
        // Arrange
        $expectedRefreshedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.refreshed.token';
        
        $this->authRepositoryMock
            ->shouldReceive('refresh')
            ->once()
            ->andReturn($expectedRefreshedToken);

        // Act
        $result = $this->refreshTokenUseCase->execute();

        // Assert
        $this->assertEquals($expectedRefreshedToken, $result);
        $this->assertIsString($result);
    }

    public function test_execute_calls_repository_refresh_method(): void
    {
        // Arrange
        $refreshedToken = 'new.jwt.token';
        
        $this->authRepositoryMock
            ->shouldReceive('refresh')
            ->once()
            ->andReturn($refreshedToken);

        // Act
        $this->refreshTokenUseCase->execute();

        // Assert
        $this->authRepositoryMock->shouldHaveReceived('refresh')->once();
    }

    public function test_execute_returns_string_token(): void
    {
        // Arrange
        $mockToken = 'valid.refreshed.jwt.token.string';
        
        $this->authRepositoryMock
            ->shouldReceive('refresh')
            ->once()
            ->andReturn($mockToken);

        // Act
        $result = $this->refreshTokenUseCase->execute();

        // Assert
        $this->assertIsString($result);
        $this->assertNotEmpty($result);
        $this->assertEquals($mockToken, $result);
    }
} 