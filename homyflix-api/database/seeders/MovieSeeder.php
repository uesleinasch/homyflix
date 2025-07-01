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
                'title' => 'Homem de Ferro',
                'release_year' => 2008,
                'genre' => 'Sci-Fi',
                'synopsis' => 'Iron Man (bra/prt: Homem de Ferro)[2][3] é um filme estadunidense de super-herói de 2008 baseado no personagem homônimo da Marvel Comics. Produzido pelo Marvel Studios e distribuído pela Paramount Pictures,[a] é o primeiro filme do Universo Cinematográfico Marvel. O filme foi dirigido por Jon Favreau, com um roteiro escrito por Mark Fergus & Hawk Ostby e Art Marcum & Matt Holloway.',
                'poster_url' => 'https://upload.wikimedia.org/wikipedia/pt/thumb/0/00/Iron_Man_poster.jpg/250px-Iron_Man_poster.jpg',
                'user_id' => $firstUser->id,
            ]);

            Movie::create([
                'title' => 'O Incrível Hulk',
                'release_year' => 2008,
                'genre' => 'Ação',
                'synopsis' => 'The Incredible Hulk (Br/Prt: O Incrível Hulk)[3][4] é um filme estadunidense de super-herói de 2008 baseado no personagem Hulk da Marvel Comics, produzido pela Marvel Studios e distribuído pela Universal Pictures.',
                'poster_url' => 'https://upload.wikimedia.org/wikipedia/pt/thumb/1/1b/The_Incredible_Hulk.jpg/250px-The_Incredible_Hulk.jpg',
                'user_id' => $firstUser->id,
            ]);
        }
    }
} 