<?php

namespace Database\Factories;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Movie>
 */
class MovieFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Movie::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'release_year' => $this->faker->numberBetween(1950, 2024),
            'genre' => $this->faker->randomElement([
                'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 
                'Sci-Fi', 'Thriller', 'Adventure', 'Animation', 'Documentary'
            ]),
            'synopsis' => $this->faker->paragraph(3),
            'poster_url' => $this->faker->optional()->url(),
            'user_id' => User::factory(),
        ];
    }
} 