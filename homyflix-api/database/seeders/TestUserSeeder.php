<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'John Smith',
                'email' => 'test@jacto.com',
                'password' => Hash::make('123456789'),
                'email_verified_at' => now(),
            ]
        );
        if (config('database.default') === 'pgsql') {
            \DB::statement("SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))");
        }
    }
} 