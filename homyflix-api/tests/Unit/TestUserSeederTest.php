<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class TestUserSeederTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Testa se o usuário padrão de teste é criado corretamente
     */
    public function test_default_test_user_is_created(): void
    {

        $this->seed(\Database\Seeders\TestUserSeeder::class);

        $user = User::find(1);
        
        $this->assertNotNull($user);
        $this->assertEquals(1, $user->id);
        $this->assertEquals('John Smith', $user->name);
        $this->assertEquals('test@jacto.com', $user->email);
        $this->assertNotNull($user->email_verified_at);
        

        $this->assertTrue(Hash::check('123456789', $user->password));
    }

    /**
     * Testa se o usuário pode fazer login com as credenciais padrão
     */
    public function test_default_test_user_can_login(): void
    {

        $this->seed(\Database\Seeders\TestUserSeeder::class);


        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@jacto.com',
            'password' => '123456789'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'access_token',
                     'token_type',
                     'expires_in'
                 ]);
        $this->assertNotEmpty($response->json('access_token'));
        $this->assertEquals('bearer', $response->json('token_type'));
        $this->assertIsInt($response->json('expires_in'));
    }

    /**
     * Testa se o seeder atualiza o usuário caso ele já exista
     */
    public function test_seeder_updates_existing_user(): void
    {
        User::create([
            'id' => 1,
            'name' => 'Old Name',
            'email' => 'old@email.com',
            'password' => Hash::make('oldpassword')
        ]);
        $this->seed(\Database\Seeders\TestUserSeeder::class);
        $user = User::find(1);
        $this->assertEquals('John Smith', $user->name);
        $this->assertEquals('test@jacto.com', $user->email);
        $this->assertTrue(Hash::check('123456789', $user->password));
    }
} 