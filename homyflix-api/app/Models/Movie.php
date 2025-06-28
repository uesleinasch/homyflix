<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'release_year',
        'genre',
        'synopsis',
        'poster_url',
        'user_id',
    ];

    /**
     * Get the user that owns the movie.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
