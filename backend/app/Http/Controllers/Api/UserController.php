<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpdateUserRequest;
use App\Http\Requests\Api\UserUpdateLocationRequest;
use App\Models\User;
use App\Services\HaversineService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $authUser = Auth::user();

        $users = User::query()
            ->where('updated_at', '>', Carbon::now()->subDay())
            ->where('id', '!=', $authUser->id)
            ->get(['id', 'first_name', 'last_name', 'latitude', 'longitude']);

        $closeUsers = $users->filter(function ($user) use ($authUser) {
            if (data_get($user, 'latitude') === null && data_get($user, 'longitude') === null) {
                return false;
            }

            $distance = HaversineService::calculateDistance(
                $user->latitude,
                $user->longitude,
                $authUser->latitude,
                $authUser->longitude,
            );

            return $distance < config('constants.max_distance_km');
        });

        return response()->json($closeUsers->values());
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => $user,
        ]);
    }

    public function update(UpdateUserRequest $request): JsonResponse
    {
        $user = auth()->user();

        $user->update($request->validated());

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user,
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }

    public function updateLocation(UserUpdateLocationRequest $request): JsonResponse
    {
        $user = Auth::user();
        $user->update($request->validated());

        return response()->json([
            'message' => 'User location updated successfully',
            'data' => $user,
        ]);
    }
}
