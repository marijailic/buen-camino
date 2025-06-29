<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            "email" => "example@example.com",
            "password" => Hash::make('password'),
            "latitude" => 45.1772416,
            "longitude" => 13.9722752,
        ]);

        $users = User::factory(20)->create();

        $users->each(function ($user) {
            Post::factory(rand(10, 15))->create([
                'user_id' => $user->id,
            ]);
        });

        $conversationalists = $users->random(15);

        $conversationalists->each(function ($sender) use ($conversationalists) {
            $receivers = $conversationalists->where('id', '!=', $sender->id)->random(rand(2, 4));

            foreach ($receivers as $receiver) {
                foreach (range(1, rand(2, 5)) as $_) {
                    Message::factory()->create([
                        'sender_id' => $sender->id,
                        'receiver_id' => $receiver->id,
                    ]);

                    Message::factory()->create([
                        'sender_id' => $receiver->id,
                        'receiver_id' => $sender->id,
                    ]);
                }
            }
        });
    }
}
