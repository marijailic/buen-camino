<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreMessageRequest;
use App\Http\Requests\Api\UpdateMessageRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    public function getByReceiver(User $receiver): JsonResponse
    {
        $authUserId = auth()->id();
        $receiverId = $receiver->id;

        $messages = Message::with(['sender', 'receiver'])
            ->where(function ($query) use ($authUserId, $receiverId) {
                $query->where('sender_id', $authUserId)
                    ->where('receiver_id', $receiverId);
            })
            ->orWhere(function ($query) use ($authUserId, $receiverId) {
                $query->where('sender_id', $receiverId)
                    ->where('receiver_id', $authUserId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($messages);
    }

    public function store(StoreMessageRequest $request): JsonResponse
    {
        $message = Message::create($request->validated());

        return response()->json([
            'message' => 'Message created successfully',
            'data' => $message,
        ], 201);
    }

    public function show(Message $message): JsonResponse
    {
        return response()->json([
            'data' => $message,
        ]);
    }

    public function update(UpdateMessageRequest $request, Message $message): JsonResponse
    {
        $message->update($request->validated());

        return response()->json([
            'message' => 'Message updated successfully',
            'data' => $message,
        ]);
    }

    public function destroy(Message $message): JsonResponse
    {
        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully',
        ]);
    }
}
