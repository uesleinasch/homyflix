<?php

namespace Tests\Unit\Auth;

use Tests\TestCase;
use App\Application\Auth\UseCases\LogoutUserUseCase;
use App\Domain\Auth\Contracts\AuthRepositoryInterface;
use Mockery;
use Mockery\MockInterface;

class LogoutUserUseCaseTest extends TestCase
{
    private LogoutUserUseCase $logoutUserUseCase;
    private MockInterface $authRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Arrange - Criando mock do repositório
        $this->authRepositoryMock = Mockery::mock(AuthRepositoryInterface::class);
        $this->logoutUserUseCase = new LogoutUserUseCase($this->authRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_calls_repository_logout_method(): void
    {
        // Arrange
        $this->authRepositoryMock
            ->shouldReceive('logout')
            ->once()
            ->andReturnNull();

        // Act
        $this->logoutUserUseCase->execute();

        // Assert
        $this->authRepositoryMock->shouldHaveReceived('logout')->once();
    }

    public function test_execute_returns_void(): void
    {
        // Arrange
        $this->authRepositoryMock
            ->shouldReceive('logout')
            ->once()
            ->andReturnNull();

        // Act
        $result = $this->logoutUserUseCase->execute();

        // Assert
        $this->assertNull($result);
    }

    public function test_execute_completes_successfully_without_exceptions(): void
    {
        // Arrange
        $this->authRepositoryMock
            ->shouldReceive('logout')
            ->once()
            ->andReturnNull();

        // Act & Assert - Não deve lançar exceções
        $this->expectNotToPerformAssertions();
        
        try {
            $this->logoutUserUseCase->execute();
            $this->assertTrue(true); // Se chegou até aqui, não houve exceção
        } catch (\Exception $e) {
            $this->fail('Logout use case should not throw exceptions: ' . $e->getMessage());
        }
    }
} 