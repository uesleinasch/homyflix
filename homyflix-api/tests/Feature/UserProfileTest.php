<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserProfileTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create([
            'name' => 'Usuário Teste',
            'email' => 'teste@email.com',
            'password' => Hash::make('password123')
        ]);
        
        $this->token = JWTAuth::fromUser($this->user);
    }

    /** @test */
    public function it_can_get_user_profile(): void
    {
        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->get('/api/user/profile');

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at'
                ]
            ])
            ->assertJson([
                'data' => [
                    'id' => $this->user->id,
                    'name' => 'Usuário Teste',
                    'email' => 'teste@email.com'
                ]
            ]);
    }

    /** @test */
    public function it_can_update_user_profile_with_all_fields(): void
    {
        // Arrange
        $updateData = [
            'name' => 'Nome Atualizado',
            'email' => 'novo@email.com',
            'password' => 'novasenha123',
            'password_confirmation' => 'novasenha123'
        ];

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->patch('/api/user/profile', $updateData);

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at'
                ]
            ])
            ->assertJson([
                'data' => [
                    'name' => 'Nome Atualizado',
                    'email' => 'novo@email.com'
                ]
            ]);

        // Verificar se os dados foram atualizados no banco
        $this->user->refresh();
        $this->assertEquals('Nome Atualizado', $this->user->name);
        $this->assertEquals('novo@email.com', $this->user->email);
        $this->assertTrue(Hash::check('novasenha123', $this->user->password));
    }

    /** @test */
    public function it_can_update_user_profile_with_partial_fields(): void
    {
        // Arrange
        $updateData = [
            'name' => 'Só Nome Novo'
        ];

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->patch('/api/user/profile', $updateData);

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'name' => 'Só Nome Novo',
                    'email' => 'teste@email.com' // E-mail deve permanecer o mesmo
                ]
            ]);

        // Verificar se apenas o nome foi atualizado
        $this->user->refresh();
        $this->assertEquals('Só Nome Novo', $this->user->name);
        $this->assertEquals('teste@email.com', $this->user->email);
    }

    /** @test */
    public function it_validates_email_uniqueness_when_updating(): void
    {
        // Arrange - Cadastrar outro usuário com e-mail que queremos usar
        User::factory()->create(['email' => 'jatemuso@email.com']);
        
        $updateData = [
            'email' => 'jatemuso@email.com'
        ];

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->patch('/api/user/profile', $updateData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /** @test */
    public function it_validates_password_confirmation(): void
    {
        // Arrange
        $updateData = [
            'password' => 'novasenha123',
            'password_confirmation' => 'senhadiferente'
        ];

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->patch('/api/user/profile', $updateData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    /** @test */
    public function it_requires_authentication_to_access_profile(): void
    {
        // Act - Tentar acessar sem token
        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->get('/api/user/profile');

        // Assert
        $response->assertStatus(401);
    }

    /** @test */
    public function it_requires_authentication_to_update_profile(): void
    {
        // Arrange
        $updateData = [
            'name' => 'Tentativa sem auth'
        ];

        // Act - Tentar atualizar sem token
        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->patch('/api/user/profile', $updateData);

        // Assert
        $response->assertStatus(401);
    }

    /** @test */
    public function it_can_update_email_to_same_email(): void
    {
        // Arrange - Tentar atualizar para o mesmo e-mail (deve permitir)
        $updateData = [
            'email' => $this->user->email
        ];

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->patch('/api/user/profile', $updateData);

        // Assert
        $response->assertStatus(200);
    }
} 