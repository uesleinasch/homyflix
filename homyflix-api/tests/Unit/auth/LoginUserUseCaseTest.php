<?php

namespace Tests\Unit\Auth;

use Tests\TestCase;
use App\Application\Auth\UseCases\LoginUserUseCase;
use App\Application\Auth\DTOs\AuthCredentialsDTO;
use App\Domain\Auth\Contracts\AuthRepositoryInterface;
use Illuminate\Validation\ValidationException;
use Mockery;
use Mockery\MockInterface;

class LoginUserUseCaseTest extends TestCase
{
    private LoginUserUseCase $loginUserUseCase;
    private MockInterface $authRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Arrange - Criando mock do repositório
        $this->authRepositoryMock = Mockery::mock(AuthRepositoryInterface::class);
        $this->loginUserUseCase = new LoginUserUseCase($this->authRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }


    public function test_execute_returns_token_when_credentials_are_valid(): void
    {
        // Arrange
        $credentialsDTO = new AuthCredentialsDTO(
            email: 'test@jacto.com',
            password: '123456789'
        );
        
        $expectedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.test.token';
        
        $this->authRepositoryMock
            ->shouldReceive('attempt')
            ->once()
            ->with([
                'email' => 'test@jacto.com',
                'password' => '123456789'
            ])
            ->andReturn($expectedToken);

        // Act
        $result = $this->loginUserUseCase->execute($credentialsDTO);

        // Assert
        $this->assertEquals($expectedToken, $result);
        $this->assertIsString($result);
    }

    public function test_execute_throws_validation_exception_when_credentials_are_invalid(): void
    {
        // Arrange
        $credentialsDTO = new AuthCredentialsDTO(
            email: 'invalid@email.com',
            password: 'wrongpassword'
        );
        
        $this->authRepositoryMock
            ->shouldReceive('attempt')
            ->once()
            ->with([
                'email' => 'invalid@email.com',
                'password' => 'wrongpassword'
            ])
            ->andReturn(false);

        // Act & Assert
        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage(__('auth.failed'));
        $this->loginUserUseCase->execute($credentialsDTO);
    }


    public function test_execute_calls_repository_attempt_with_correct_parameters(): void
    {
        // Arrange
        $credentialsDTO = new AuthCredentialsDTO(
            email: 'user@example.com',
            password: 'password123'
        );
        
        $expectedToken = 'valid.jwt.token';
        
        $this->authRepositoryMock
            ->shouldReceive('attempt')
            ->once()
            ->with([
                'email' => 'user@example.com',
                'password' => 'password123'
            ])
            ->andReturn($expectedToken);

        // Act
        $result = $this->loginUserUseCase->execute($credentialsDTO);

        // Assert
        $this->assertEquals($expectedToken, $result);
        $this->authRepositoryMock->shouldHaveReceived('attempt')->once();
    }
} 