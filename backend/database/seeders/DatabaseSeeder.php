<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'email' => 'example@example.com',
        ]);

        Post::factory()->count(15)->create([
            'user_id' => $user->id,
        ]);

        $users = User::factory(50)->create();

        $users->each(function ($user) {
            Post::factory(rand(10, 15))->create([
                'user_id' => $user->id,
            ]);
        });

        $conversationPartners = $users->random(35);

        foreach ($conversationPartners as $receiver) {
            foreach (range(1, rand(2, 5)) as $_) {
                Message::factory()->create([
                    'sender_id' => $user->id,
                    'receiver_id' => $receiver->id,
                ]);

                Message::factory()->create([
                    'sender_id' => $receiver->id,
                    'receiver_id' => $user->id,
                ]);
            }
        }

        $chatPeople = $users->random(15);

        $chatPeople->each(function ($sender) use ($chatPeople) {
            $receivers = $chatPeople->where('id', '!=', $sender->id)->random(rand(2, 4));

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
