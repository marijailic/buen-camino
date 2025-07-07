<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StorePostRequest;
use App\Http\Requests\Api\UpdatePostRequest;
use App\Models\Post;
use App\Models\User;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    public function __construct(private CloudinaryService $cloudinaryService) {}

    public function getByUser(User $user): JsonResponse
    {
        $posts = $user->posts()->latest()->get();

        foreach ($posts as $post) {
            if (!$post->has_image) {
                $post->image_url = null;
                continue;
            }

            try {
                $post->image_url = $this->cloudinaryService->getImageUrl($post->id);
            } catch (\Exception $e) {
                $post->image_url = null;
            }
        }

        return response()->json([
            'data' => $posts,
        ]);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = Post::create($request->except('image'));

        $image = $request->file('image');
        if ($image) {
            $imageContents = file_get_contents($image->getRealPath());

            $post->has_image = true;
            $post->save();
            $this->cloudinaryService->storeImage($post->id, base64_encode($imageContents));
        }

        return response()->json([
            'message' => 'Post created successfully',
            'data' => $post,
        ], 201);
    }

    public function show(Post $post): JsonResponse
    {
        try {
            $imageUrl = $this->cloudinaryService->getImageUrl($post->id);
        } catch (\Exception $e) {
            $imageUrl = null;
        }
        return response()->json([
            'data' => $post,
            'imageUrl' => $imageUrl,
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $post->update($request->validated());

        return response()->json([
            'message' => 'Post updated successfully',
            'data' => $post,
        ]);
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
    }
}
