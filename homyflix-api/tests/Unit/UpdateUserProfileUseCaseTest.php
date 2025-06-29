<?php

namespace Tests\Unit;

use App\Application\User\DTOs\UpdateUserDTO;
use App\Application\User\UseCases\UpdateUserProfileUseCase;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Models\User;
use PHPUnit\Framework\TestCase;
use Mockery;

class UpdateUserProfileUseCaseTest extends TestCase
{
    private UpdateUserProfileUseCase $updateUserProfileUseCase;
    private UserRepositoryInterface $mockUserRepository;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->mockUserRepository = Mockery::mock(UserRepositoryInterface::class);
        $this->updateUserProfileUseCase = new UpdateUserProfileUseCase($this->mockUserRepository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_can_update_user_profile_with_all_fields(): void
    {
        // Arrange
        $userId = 1;
        $updateDTO = new UpdateUserDTO(
            name: 'Novo Nome',
            email: 'novo@email.com',
            password: 'novasenha123'
        );

        $expectedUpdateData = [
            'name' => 'Novo Nome',
            'email' => 'novo@email.com',
            'password' => 'novasenha123'
        ];

        $expectedUser = new User([
            'id' => $userId,
            'name' => 'Novo Nome',
            'email' => 'novo@email.com'
        ]);

        $this->mockUserRepository
            ->shouldReceive('update')
            ->once()
            ->with($userId, $expectedUpdateData)
            ->andReturn($expectedUser);

        // Act
        $result = $this->updateUserProfileUseCase->execute($userId, $updateDTO);

        // Assert
        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals('Novo Nome', $result->name);
        $this->assertEquals('novo@email.com', $result->email);
    }

    /** @test */
    public function it_can_update_user_profile_with_partial_fields(): void
    {
        // Arrange
        $userId = 1;
        $updateDTO = new UpdateUserDTO(
            name: 'Só Nome',
            email: null,
            password: null
        );

        $expectedUpdateData = [
            'name' => 'Só Nome'
        ];

        $expectedUser = new User([
            'id' => $userId,
            'name' => 'Só Nome',
            'email' => 'email@antigo.com'
        ]);

        $this->mockUserRepository
            ->shouldReceive('update')
            ->once()
            ->with($userId, $expectedUpdateData)
            ->andReturn($expectedUser);

        // Act
        $result = $this->updateUserProfileUseCase->execute($userId, $updateDTO);

        // Assert
        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals('Só Nome', $result->name);
    }

    /** @test */
    public function it_should_not_include_null_fields_in_update(): void
    {
        // Arrange
        $userId = 1;
        $updateDTO = new UpdateUserDTO(
            name: null,
            email: 'novo@email.com',
            password: null
        );

        $expectedUpdateData = [
            'email' => 'novo@email.com'
        ];

        $expectedUser = new User([
            'id' => $userId,
            'name' => 'Nome Antigo',
            'email' => 'novo@email.com'
        ]);

        $this->mockUserRepository
            ->shouldReceive('update')
            ->once()
            ->with($userId, $expectedUpdateData)
            ->andReturn($expectedUser);

        // Act
        $result = $this->updateUserProfileUseCase->execute($userId, $updateDTO);

        // Assert
        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals('novo@email.com', $result->email);
    }
} 