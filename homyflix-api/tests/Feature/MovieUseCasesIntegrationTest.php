<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class MovieUseCasesIntegrationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = JWTAuth::fromUser($this->user);
    }

    /** @test */
    public function it_can_create_movie_through_use_case(): void
    {
        // Arrange
        $movieData = [
            'title' => 'Test Movie via Use Case',
            'release_year' => 2024,
            'genre' => 'Action',
            'synopsis' => 'Test synopsis for use case test',
            'poster_url' => 'https://example.com/poster.jpg'
        ];

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->postJson('/api/movies', $movieData);

        // Assert
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'release_year',
                    'genre',
                    'synopsis',
                    'poster_url',
                    'user_id',
                    'created_at',
                    'updated_at'
                ]
            ])
            ->assertJson([
                'data' => [
                    'title' => 'Test Movie via Use Case',
                    'release_year' => 2024,
                    'genre' => 'Action',
                    'synopsis' => 'Test synopsis for use case test',
                    'user_id' => $this->user->id
                ]
            ]);

        $this->assertDatabaseHas('movies', [
            'title' => 'Test Movie via Use Case',
            'user_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_can_update_movie_through_use_case(): void
    {
        // Arrange
        $movie = Movie::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Original Title'
        ]);

        $updateData = [
            'title' => 'Updated Title via Use Case',
            'genre' => 'Updated Genre'
        ];

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->putJson("/api/movies/{$movie->id}", $updateData);

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $movie->id,
                    'title' => 'Updated Title via Use Case',
                    'genre' => 'Updated Genre',
                    'user_id' => $this->user->id
                ]
            ]);

        $this->assertDatabaseHas('movies', [
            'id' => $movie->id,
            'title' => 'Updated Title via Use Case',
            'genre' => 'Updated Genre'
        ]);
    }

    /** @test */
    public function it_can_get_movie_by_id_through_use_case(): void
    {
        // Arrange
        $movie = Movie::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Test Movie for Get'
        ]);

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->getJson("/api/movies/{$movie->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $movie->id,
                    'title' => 'Test Movie for Get',
                    'user_id' => $this->user->id
                ]
            ]);
    }

    /** @test */
    public function it_can_get_user_movies_through_use_case(): void
    {
        // Arrange
        $userMovies = Movie::factory(3)->create(['user_id' => $this->user->id]);
        $otherUserMovies = Movie::factory(2)->create(); // Different user

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->getJson('/api/movies');

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'release_year',
                        'genre',
                        'synopsis',
                        'user_id'
                    ]
                ]
            ]);

        // Should only return user's movies (3 movies)
        $responseData = $response->json('data');
        $this->assertCount(3, $responseData);
        
        foreach ($responseData as $movieData) {
            $this->assertEquals($this->user->id, $movieData['user_id']);
        }
    }

    /** @test */
    public function it_can_delete_movie_through_use_case(): void
    {
        // Arrange
        $movie = Movie::factory()->create([
            'user_id' => $this->user->id
        ]);

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->deleteJson("/api/movies/{$movie->id}");

        // Assert
        $response->assertStatus(204);
        
        $this->assertDatabaseMissing('movies', [
            'id' => $movie->id
        ]);
    }

    /** @test */
    public function it_prevents_user_from_accessing_other_users_movies(): void
    {
        // Arrange
        $otherUser = User::factory()->create();
        $otherUserMovie = Movie::factory()->create([
            'user_id' => $otherUser->id
        ]);

        // Act & Assert - Try to get other user's movie
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->getJson("/api/movies/{$otherUserMovie->id}");

        $response->assertStatus(404);

        // Act & Assert - Try to update other user's movie
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->putJson("/api/movies/{$otherUserMovie->id}", [
            'title' => 'Hacked Title'
        ]);

        $response->assertStatus(404);

        // Act & Assert - Try to delete other user's movie
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->deleteJson("/api/movies/{$otherUserMovie->id}");

        $response->assertStatus(404);
    }
} 