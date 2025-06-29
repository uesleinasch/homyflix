<?php

namespace Tests\Unit\User;

use Tests\TestCase;
use App\Application\User\UseCases\RegisterUserUseCase;
use App\Application\User\DTOs\CreateUserDTO;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Models\User;
use Mockery;
use Mockery\MockInterface;

class RegisterUserUseCaseTest extends TestCase
{
    private RegisterUserUseCase $registerUserUseCase;
    private MockInterface $userRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->userRepositoryMock = Mockery::mock(UserRepositoryInterface::class);
        $this->registerUserUseCase = new RegisterUserUseCase($this->userRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_creates_user_successfully(): void
    {
        // Arrange
        $createUserDTO = new CreateUserDTO(
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        );

        $expectedUser = new User([
            'id' => 1,
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);

        $this->userRepositoryMock
            ->shouldReceive('create')
            ->once()
            ->with([
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => 'password123'
            ])
            ->andReturn($expectedUser);

        // Act
        $result = $this->registerUserUseCase->execute($createUserDTO);

        // Assert
        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals('John Doe', $result->name);
        $this->assertEquals('john@example.com', $result->email);
    }

    public function test_execute_calls_repository_create_with_correct_parameters(): void
    {
        // Arrange
        $createUserDTO = new CreateUserDTO(
            name: 'Jane Smith',
            email: 'jane@test.com',
            password: 'securepass456'
        );

        $mockUser = new User(['id' => 2, 'name' => 'Jane Smith', 'email' => 'jane@test.com']);

        $this->userRepositoryMock
            ->shouldReceive('create')
            ->once()
            ->with([
                'name' => 'Jane Smith',
                'email' => 'jane@test.com',
                'password' => 'securepass456'
            ])
            ->andReturn($mockUser);

        // Act
        $this->registerUserUseCase->execute($createUserDTO);

        // Assert
        $this->userRepositoryMock->shouldHaveReceived('create')->once();
    }

    public function test_execute_returns_user_instance(): void
    {
        // Arrange
        $createUserDTO = new CreateUserDTO(
            name: 'Test User',
            email: 'test@domain.com',
            password: 'testpass789'
        );

        $createdUser = new User([
            'id' => 3,
            'name' => 'Test User',
            'email' => 'test@domain.com'
        ]);

        $this->userRepositoryMock
            ->shouldReceive('create')
            ->once()
            ->andReturn($createdUser);

        // Act
        $result = $this->registerUserUseCase->execute($createUserDTO);

        // Assert
        $this->assertInstanceOf(User::class, $result);
        $this->assertNotNull($result);
        $this->assertEquals($createdUser, $result);
    }
} 