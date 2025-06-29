<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use DatabaseTransactions; // Usa transações para rollback automático

    /**
     * Setup executado antes de cada teste
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Configurar ambiente de teste
        $this->setupTestEnvironment();
    }

    /**
     * Configurações específicas do ambiente de teste
     */
    protected function setupTestEnvironment(): void
    {
        // Garantir que estamos em ambiente de teste
        $this->app['config']->set('app.env', 'testing');
        
        // Configurar banco de dados de teste
        $this->app['config']->set('database.default', 'pgsql');
        $this->app['config']->set('database.connections.pgsql', [
            'driver' => 'pgsql',
            'host' => env('DB_HOST', 'postgres'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'homyflix_test'),
            'username' => env('DB_USERNAME', 'homyflix'),
            'password' => env('DB_PASSWORD', 'password'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ]);

        // Configurar cache para testes
        $this->app['config']->set('cache.default', 'array');
        
        // Configurar sessão para testes
        $this->app['config']->set('session.driver', 'array');
        
        // Configurar queue para testes
        $this->app['config']->set('queue.default', 'sync');
        
        // Configurar mail para testes
        $this->app['config']->set('mail.default', 'array');
        
        // Configurar logging para testes
        $this->app['config']->set('logging.default', 'single');
        $this->app['config']->set('logging.channels.single.level', 'error');
        
        // Configurar JWT para testes
        $this->app['config']->set('jwt.ttl', 60);
        
        // Desabilitar verificação de CSRF para testes de API
        $this->withoutMiddleware([
            \App\Http\Middleware\VerifyCsrfToken::class,
        ]);
    }

    /**
     * Executar migrations antes dos testes se necessário
     */
    protected function runMigrations(): void
    {
        $this->artisan('migrate:fresh');
    }

    /**
     * Criar usuário de teste autenticado
     */
    protected function createAuthenticatedUser(array $attributes = []): \App\Models\User
    {
        $user = \App\Models\User::factory()->create($attributes);
        $this->actingAs($user);
        return $user;
    }

    /**
     * Criar token JWT para usuário
     */
    protected function createJwtTokenForUser(\App\Models\User $user): string
    {
        return auth('api')->login($user);
    }

    /**
     * Headers padrão para requisições da API
     */
    protected function getApiHeaders(string $token = null): array
    {
        $headers = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];

        if ($token) {
            $headers['Authorization'] = "Bearer {$token}";
        }

        return $headers;
    }

    /**
     * Fazer requisição autenticada para API
     */
    protected function authenticatedJson(
        string $method, 
        string $uri, 
        array $data = [], 
        \App\Models\User $user = null
    ) {
        if (!$user) {
            $user = $this->createAuthenticatedUser();
        }
        
        $token = $this->createJwtTokenForUser($user);
        $headers = $this->getApiHeaders($token);
        
        return $this->json($method, $uri, $data, $headers);
    }

    /**
     * Limpar cache entre testes
     */
    protected function tearDown(): void
    {
        if ($this->app) {
            $this->app['cache']->flush();
        }
        
        parent::tearDown();
    }
}
