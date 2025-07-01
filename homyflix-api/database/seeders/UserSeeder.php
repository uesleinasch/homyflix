<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@jacto.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@jacto.com',
                'password' => '12345678',
                'email_verified_at' => now(),
            ]
        );

        // Adicionar log para debug
        $this->command->info('✅ Usuário admin criado/atualizado com sucesso!');
    }
}
