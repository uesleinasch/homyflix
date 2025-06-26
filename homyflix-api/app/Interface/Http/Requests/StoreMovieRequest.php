<?php

namespace App\Interface\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMovieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // A lógica de autorização será tratada no controller ou em um policy
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'release_year' => 'required|integer|min:1888',
            'genre' => 'required|string|max:100',
            'synopsis' => 'required|string',
            'duration_in_minutes' => 'required|integer|min:1',
            'poster_url' => 'nullable|url',
        ];
    }
}
