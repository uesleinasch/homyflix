<?php

namespace App\Interface\Http\Controllers\Api;

use App\Application\Movie\DTOs\CreateMovieDTO;
use App\Application\Movie\DTOs\UpdateMovieDTO;
use App\Application\Movie\Services\MovieApplicationService;
use App\Http\Controllers\Controller;
use App\Interface\Http\Requests\StoreMovieRequest;
use App\Interface\Http\Requests\UpdateMovieRequest;
use App\Interface\Http\Resources\MovieResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MovieController extends Controller
{
    public function __construct(private readonly MovieApplicationService $movieApplicationService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->query('per_page', 15);
        $userId = auth()->id();
        
        $movies = $this->movieApplicationService->getUserMovies($userId, $perPage);
        return MovieResource::collection($movies);
    }

    public function show(int $id): MovieResource
    {
        $userId = auth()->id();
        $movie = $this->movieApplicationService->getMovieById($id, $userId);
        return new MovieResource($movie);
    }

    public function store(StoreMovieRequest $request): MovieResource
    {
        $userId = auth()->id();
        $createMovieDTO = CreateMovieDTO::fromRequest($request->validated(), $userId);
        
        $movie = $this->movieApplicationService->createMovie($createMovieDTO);
        return new MovieResource($movie);
    }

    public function update(UpdateMovieRequest $request, int $id): MovieResource
    {
        $userId = auth()->id();
        $updateMovieDTO = UpdateMovieDTO::fromRequest($request->validated());
        
        $movie = $this->movieApplicationService->updateMovie($id, $updateMovieDTO, $userId);
        return new MovieResource($movie);
    }

    public function destroy(int $id): JsonResponse
    {
        $userId = auth()->id();
        $this->movieApplicationService->deleteMovie($id, $userId);
        return response()->json(null, 204);
    }
}
