<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\GetMessageRequest;
use App\Http\Requests\Api\StoreMessageRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function allMessagesByReceiver(GetMessageRequest $request, User $receiver)
    {
        $messages = Message::where('sender_id', auth()->id())
            ->where('receiver_id', $receiver->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10));

        return response()->json($messages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMessageRequest $request)
    {
        $validated = $request->validated();

        $message = Message::create([
            'text' => $validated['text'],
            'sender_id' => $validated['sender_id'],
            'receiver_id' => $validated['receiver_id'],
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        return response()->json([
            'message' => $message,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreMessageRequest $request, Message $message)
    {
        $data = $request->validated();

        $message->update($data);

        return response()->json([
            'message' => 'Message updated successfully',
            'messageData' => $message->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully',
        ]);
    }
}
