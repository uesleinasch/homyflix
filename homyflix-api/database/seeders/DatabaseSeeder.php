<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    public function run(): void
    {
        if (app()->environment('testing')) {
            $this->call([
                TestUserSeeder::class,
            ]);
            return;
        }

        $this->call([
            UserSeeder::class,
            MovieSeeder::class,
        ]);
    }
}
