<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::take(3)->get();
        
        if ($users->isEmpty()) {
            $users = User::factory()->count(3)->create();
        }

        foreach ($users as $user) {
            Movie::factory()->count(5)->create([
                'user_id' => $user->id
            ]);
        }

        if ($users->count() > 0) {
            $firstUser = $users->first();
            
            Movie::create([
                'title' => 'The Matrix',
                'release_year' => 1999,
                'genre' => 'Sci-Fi',
                'synopsis' => 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.',
                'poster_url' => 'https://example.com/matrix.jpg',
                'user_id' => $firstUser->id,
            ]);

            Movie::create([
                'title' => 'Inception',
                'release_year' => 2010,
                'genre' => 'Thriller',
                'synopsis' => 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                'poster_url' => 'https://example.com/inception.jpg',
                'user_id' => $firstUser->id,
            ]);
        }
    }
} 