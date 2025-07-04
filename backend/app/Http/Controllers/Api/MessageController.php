<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreMessageRequest;
use App\Http\Requests\Api\UpdateMessageRequest;
use App\Models\Message;
use App\Services\PusherService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    public function getByReceiver(string $userId): JsonResponse
    {
        $authUserId = auth()->id();

        $messages = Message::with(['sender', 'receiver'])
            ->where(function (Builder $query) use ($authUserId, $userId) {
                $query->where('sender_id', $authUserId)->where('receiver_id', $userId);
            })
            ->orWhere(function ($query) use ($authUserId, $userId) {
                $query->where('sender_id', $userId)->where('receiver_id', $authUserId);
            })
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function getAllReceivers(): JsonResponse
    {
        $authUserId = auth()->id();

        $messages = Message::with(['sender', 'receiver'])
            ->where(function ($query) use ($authUserId) {
                $query->where('sender_id', $authUserId);
            })
            ->orWhere(function ($query) use ($authUserId) {
                $query->where('receiver_id', $authUserId);
            })
            ->orderBy('created_at', 'desc')
            ->get(['sender_id', 'receiver_id']);

        $ids = $messages->pluck('sender_id')
            ->merge($messages->pluck('receiver_id'))
            ->unique()
            ->reject(fn($id) => $id === $authUserId)
            ->values();

        return response()->json(['receiver_ids' => $ids]);
    }

    public function store(StoreMessageRequest $request): JsonResponse
    {
        $message = Message::create($request->validated());

        PusherService::newChatMessage(
            $message->id,
            $message->text,
            $message->sender_id,
            $message->receiver_id
        );

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

        PusherService::updateChatMessage(
            $message->id,
            $message->text,
            $message->sender_id,
            $message->receiver_id
        );

        return response()->json([
            'message' => 'Message updated successfully',
            'data' => $message,
        ]);
    }

    public function destroy(Message $message): JsonResponse
    {
        $message->delete();

        PusherService::deleteChatMessage(
            $message->id,
            $message->sender_id,
            $message->receiver_id
        );

        return response()->json([
            'message' => 'Message deleted successfully',
        ]);
    }
}
