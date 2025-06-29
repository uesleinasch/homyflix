<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Se estivermos no ambiente de teste, executa apenas o TestUserSeeder
        if (app()->environment('testing')) {
            $this->call([
                TestUserSeeder::class,
            ]);
            return;
        }

        // Para outros ambientes, executa os seeders normais
        $this->call([
            UserSeeder::class,
            MovieSeeder::class,
        ]);
    }
}
