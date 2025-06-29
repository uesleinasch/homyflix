<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class MovieApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = JWTAuth::fromUser($this->user);
    }

    /** @test */
    public function it_can_list_only_user_movies(): void
    {
        // Arrange
        $otherUser = User::factory()->create();
        
        // Filmes do usuário autenticado
        $userMovies = Movie::factory()->count(3)->create([
            'user_id' => $this->user->id
        ]);
        
        // Filmes de outro usuário (não devem aparecer)
        Movie::factory()->count(2)->create([
            'user_id' => $otherUser->id
        ]);

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/movies');

        // Assert
        $response->assertStatus(200)
                ->assertJsonCount(3, 'data')
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'title',
                            'release_year',
                            'genre',
                            'synopsis',
                            'poster_url',
                            'user' => [
                                'id',
                                'name'
                            ],
                            'created_at',
                            'updated_at'
                        ]
                    ]
                ]);

        // Verificar se todos os filmes retornados pertencem ao usuário autenticado
        $responseData = $response->json('data');
        foreach ($responseData as $movie) {
            $this->assertEquals($this->user->id, $movie['user']['id']);
        }
    }

    /** @test */
    public function it_can_show_only_user_movie(): void
    {
        // Arrange
        $otherUser = User::factory()->create();
        
        $userMovie = Movie::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'User Movie'
        ]);
        
        $otherUserMovie = Movie::factory()->create([
            'user_id' => $otherUser->id,
            'title' => 'Other User Movie'
        ]);

        // Act - Buscar filme do usuário
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/movies/{$userMovie->id}");

        // Assert
        $response->assertStatus(200)
                ->assertJson([
                    'data' => [
                        'id' => $userMovie->id,
                        'title' => 'User Movie',
                        'user' => [
                            'id' => $this->user->id,
                            'name' => $this->user->name
                        ]
                    ]
                ]);

        // Act - Tentar buscar filme de outro usuário
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/movies/{$otherUserMovie->id}");

        // Assert - Deve retornar 404
        $response->assertStatus(404);
    }

    /** @test */
    public function it_can_create_movie_for_authenticated_user(): void
    {
        // Arrange
        $movieData = [
            'title' => 'New Test Movie',
            'release_year' => 2024,
            'genre' => 'Action',
            'synopsis' => 'A test movie synopsis',
            'poster_url' => 'https://example.com/poster.jpg'
        ];

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/movies', $movieData);

        // Assert
        $response->assertStatus(201)
                ->assertJson([
                    'data' => [
                        'title' => 'New Test Movie',
                        'release_year' => 2024,
                        'genre' => 'Action',
                        'synopsis' => 'A test movie synopsis',
                        'poster_url' => 'https://example.com/poster.jpg',
                        'user' => [
                            'id' => $this->user->id,
                            'name' => $this->user->name
                        ]
                    ]
                ]);

        // Verificar se foi salvo no banco
        $this->assertDatabaseHas('movies', [
            'title' => 'New Test Movie',
            'user_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_can_update_only_user_movie(): void
    {
        // Arrange
        $otherUser = User::factory()->create();
        
        $userMovie = Movie::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Original Title'
        ]);
        
        $otherUserMovie = Movie::factory()->create([
            'user_id' => $otherUser->id,
            'title' => 'Other User Movie'
        ]);

        $updateData = [
            'title' => 'Updated Title'
        ];

        // Act - Atualizar filme do usuário
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/movies/{$userMovie->id}", $updateData);

        // Assert
        $response->assertStatus(200)
                ->assertJson([
                    'data' => [
                        'id' => $userMovie->id,
                        'title' => 'Updated Title',
                        'user' => [
                            'id' => $this->user->id
                        ]
                    ]
                ]);

        // Act - Tentar atualizar filme de outro usuário
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/movies/{$otherUserMovie->id}", $updateData);

        // Assert - Deve retornar 404
        $response->assertStatus(404);
    }

    /** @test */
    public function it_can_delete_only_user_movie(): void
    {
        // Arrange
        $otherUser = User::factory()->create();
        
        $userMovie = Movie::factory()->create([
            'user_id' => $this->user->id
        ]);
        
        $otherUserMovie = Movie::factory()->create([
            'user_id' => $otherUser->id
        ]);

        // Act - Deletar filme do usuário
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/movies/{$userMovie->id}");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('movies', ['id' => $userMovie->id]);

        // Act - Tentar deletar filme de outro usuário
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/movies/{$otherUserMovie->id}");

        // Assert - Deve retornar 404
        $response->assertStatus(404);
        $this->assertDatabaseHas('movies', ['id' => $otherUserMovie->id]);
    }

    /** @test */
    public function it_requires_authentication_to_access_movies(): void
    {
        // Act & Assert
        $this->getJson('/api/movies')->assertStatus(401);
        $this->getJson('/api/movies/1')->assertStatus(401);
        $this->postJson('/api/movies', [])->assertStatus(401);
        $this->putJson('/api/movies/1', [])->assertStatus(401);
        $this->deleteJson('/api/movies/1')->assertStatus(401);
    }
} 