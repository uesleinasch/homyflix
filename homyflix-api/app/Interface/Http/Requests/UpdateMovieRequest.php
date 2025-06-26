<?php

namespace App\Interface\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMovieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // A lógica de autorização será tratada no controller ou em um policy
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'release_year' => 'sometimes|required|integer|min:1888',
            'genre' => 'sometimes|required|string|max:100',
            'synopsis' => 'sometimes|required|string',
            'duration_in_minutes' => 'sometimes|required|integer|min:1',
            'poster_url' => 'nullable|url',
        ];
    }
}
