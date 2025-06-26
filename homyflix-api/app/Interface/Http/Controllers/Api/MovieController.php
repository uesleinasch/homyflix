<?php

namespace App\Interface\Http\Controllers\Api;

use App\Domain\Movie\Services\MovieService;
use App\Http\Controllers\Controller;
use App\Interface\Http\Requests\StoreMovieRequest;
use App\Interface\Http\Requests\UpdateMovieRequest;
use App\Interface\Http\Resources\MovieResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MovieController extends Controller
{
    public function __construct(private readonly MovieService $movieService)
    {
    }

    public function index(): AnonymousResourceCollection
    {
        $movies = $this->movieService->getAllMovies();
        return MovieResource::collection($movies);
    }

    public function show(int $id): MovieResource
    {
        $movie = $this->movieService->getMovieById($id);
        return new MovieResource($movie);
    }

    public function store(StoreMovieRequest $request): MovieResource
    {
        $movie = $this->movieService->createMovie($request->validated());
        return new MovieResource($movie);
    }

    public function update(UpdateMovieRequest $request, int $id): MovieResource
    {
        $movie = $this->movieService->updateMovie($id, $request->validated());
        return new MovieResource($movie);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->movieService->deleteMovie($id);
        return response()->json(null, 204);
    }
}
