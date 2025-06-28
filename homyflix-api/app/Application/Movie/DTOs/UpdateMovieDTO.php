<?php

namespace App\Application\Movie\DTOs;

class UpdateMovieDTO
{
    public function __construct(
        public readonly ?string $title = null,
        public readonly ?int $release_year = null,
        public readonly ?string $genre = null,
        public readonly ?string $synopsis = null,
        public readonly ?string $poster_url = null
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            title: $data['title'] ?? null,
            release_year: $data['release_year'] ?? null,
            genre: $data['genre'] ?? null,
            synopsis: $data['synopsis'] ?? null,
            poster_url: $data['poster_url'] ?? null
        );
    }

    public function toArray(): array
    {
        $data = [];

        if ($this->title !== null) {
            $data['title'] = $this->title;
        }

        if ($this->release_year !== null) {
            $data['release_year'] = $this->release_year;
        }

        if ($this->genre !== null) {
            $data['genre'] = $this->genre;
        }

        if ($this->synopsis !== null) {
            $data['synopsis'] = $this->synopsis;
        }

        if ($this->poster_url !== null) {
            $data['poster_url'] = $this->poster_url;
        }

        return $data;
    }
} 