<?php

namespace App\Services;

use Pusher\Pusher;

class PusherService
{
    public function newChatMessage(string $id, string $message, string $userId1, string $userId2): void
    {
        $users = [$userId1, $userId2];
        sort($users); // Ensure consistent channel naming

        self::push("chat.$users[0].$users[1]", 'new-message', [
            'id' => $id,
            'text' => $message,
            'sender_id' => $userId1,
            'receiver_id' => $userId2,
        ]);
    }

    public function updateChatMessage(string $messageId, string $message, string $userId1, string $userId2): void
    {
        $users = [$userId1, $userId2];
        sort($users); // Ensure consistent channel naming

        self::push("chat.$users[0].$users[1]", 'update-message', [
            'id' => $messageId,
            'text' => $message,
            'sender_id' => $userId1,
            'receiver_id' => $userId2,
        ]);
    }

    public function deleteChatMessage(string $messageId, string $userId1, string $userId2): void
    {
        $users = [$userId1, $userId2];
        sort($users); // Ensure consistent channel naming

        self::push("chat.$users[0].$users[1]", 'delete-message', [
            'id' => $messageId,
            'sender_id' => $userId1,
            'receiver_id' => $userId2,
        ]);
    }

    private static function push(string $channel, string $event, array $data): void
    {
        if (app()->environment('testing')) {
            return;
        }

        $appKey = config('services.pusher.app_key');
        $appSecret = config('services.pusher.app_secret');
        $appId = config('services.pusher.app_id');
        $appCluster = config('services.pusher.app_cluster');

        (new Pusher(
            auth_key: $appKey,
            secret: $appSecret,
            app_id: $appId,
            options: [
                'cluster' => $appCluster,
            ],
        ))->trigger($channel, $event, $data);
    }
}
