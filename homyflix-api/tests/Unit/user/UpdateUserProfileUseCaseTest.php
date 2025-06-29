<?php

namespace Tests\Unit\User;

use Tests\TestCase;
use App\Application\User\UseCases\UpdateUserProfileUseCase;
use App\Application\User\DTOs\UpdateUserDTO;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Models\User;
use Mockery;
use Mockery\MockInterface;

class UpdateUserProfileUseCaseTest extends TestCase
{
    private UpdateUserProfileUseCase $updateUserProfileUseCase;
    private MockInterface $userRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->userRepositoryMock = Mockery::mock(UserRepositoryInterface::class);
        $this->updateUserProfileUseCase = new UpdateUserProfileUseCase($this->userRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_execute_updates_user_successfully(): void
    {
        // Arrange
        $userId = 1;
        $updateUserDTO = new UpdateUserDTO(
            name: 'Updated Name',
            email: 'updated@example.com',
            password: 'newpassword123'
        );

        $updatedUser = new User([
            'id' => 1,
            'name' => 'Updated Name',
            'email' => 'updated@example.com'
        ]);

        $this->userRepositoryMock
            ->shouldReceive('update')
            ->once()
            ->with($userId, [
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
                'password' => 'newpassword123'
            ])
            ->andReturn($updatedUser);

        // Act
        $result = $this->updateUserProfileUseCase->execute($userId, $updateUserDTO);

        // Assert
        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals('Updated Name', $result->name);
        $this->assertEquals('updated@example.com', $result->email);
    }

    public function test_execute_calls_repository_update_with_correct_parameters(): void
    {
        // Arrange
        $userId = 2;
        $updateUserDTO = new UpdateUserDTO(
            name: 'John Updated',
            email: null,
            password: 'securepass456'
        );

        $mockUser = new User(['id' => 2, 'name' => 'John Updated']);

        $this->userRepositoryMock
            ->shouldReceive('update')
            ->once()
            ->with($userId, [
                'name' => 'John Updated',
                'password' => 'securepass456'
            ])
            ->andReturn($mockUser);

        // Act
        $this->updateUserProfileUseCase->execute($userId, $updateUserDTO);

        // Assert
        $this->userRepositoryMock->shouldHaveReceived('update')->once();
    }

    public function test_execute_updates_only_provided_fields(): void
    {
        // Arrange
        $userId = 3;
        $updateUserDTO = new UpdateUserDTO(
            name: null,
            email: 'newemail@test.com',
            password: null
        );

        $updatedUser = new User([
            'id' => 3,
            'name' => 'Existing Name',
            'email' => 'newemail@test.com'
        ]);

        $this->userRepositoryMock
            ->shouldReceive('update')
            ->once()
            ->with($userId, [
                'email' => 'newemail@test.com'
            ])
            ->andReturn($updatedUser);

        // Act
        $result = $this->updateUserProfileUseCase->execute($userId, $updateUserDTO);

        // Assert
        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals('newemail@test.com', $result->email);
        $this->assertEquals($updatedUser, $result);
    }
} 