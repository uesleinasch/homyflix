<?php

namespace App\Application\Movie\DTOs;

class CreateMovieDTO
{
    public function __construct(
        public readonly string $title,
        public readonly int $release_year,
        public readonly string $genre,
        public readonly string $synopsis,
        public readonly ?string $poster_url = null,
        public readonly int $user_id
    ) {}

    public static function fromRequest(array $data, int $userId): self
    {
        return new self(
            title: $data['title'],
            release_year: $data['release_year'],
            genre: $data['genre'],
            synopsis: $data['synopsis'],
            poster_url: $data['poster_url'] ?? null,
            user_id: $userId
        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'release_year' => $this->release_year,
            'genre' => $this->genre,
            'synopsis' => $this->synopsis,
            'poster_url' => $this->poster_url,
            'user_id' => $this->user_id,
        ];
    }
} 