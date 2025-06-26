<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MessageControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function testAllMessagesByReceiver(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();

        $this->actingAs($sender);

        Message::factory()->count(5)->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ]);

        Message::factory()->count(3)->create();

        $response = $this->getJson("/api/messages/receiver/{$receiver->id}?per_page=3");

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'current_page',
            'data' => [
                '*' => [
                    'id',
                    'sender_id',
                    'receiver_id',
                    'message',
                    'created_at',
                    'updated_at',
                ],
            ],
            'first_page_url',
            'from',
            'last_page',
            'last_page_url',
            'next_page_url',
            'path',
            'per_page',
            'prev_page_url',
            'to',
            'total',
        ]);

        $responseData = $response->json('data');
        foreach ($responseData as $msg) {
            $this->assertEquals($sender->id, $msg['sender_id']);
            $this->assertEquals($receiver->id, $msg['receiver_id']);
        }
    }

    public function testStore():void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();

        $message = fake()->paragraph;

        $payload = [
            'text' => $message,
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ];

        $this->actingAs($sender)
        ->postJson(route('messages.store'), $payload)
            ->assertCreated()
            ->assertJson([
                'message' => 'Message sent successfully',
                'data' => [
                    'text' => $message,
                    'sender_id' => $sender->id,
                    'receiver_id' => $receiver->id,
                ],
            ]);

        $this->assertDatabaseHas('messages', [
            'text' => $message,
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ]);
    }

    public function testShow(): void
    {
        $user = User::factory()->create();
        $message = Message::factory()->create([
            'sender_id' => $user->id,
        ]);

        $this->actingAs($user)
            ->getJson("/api/messages/{$message->id}")
            ->assertOk()
            ->assertJson([
                'message' => [
                    'id' => $message->id,
                    'text' => $message->text,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                ],
            ]);
    }

    public function testUpdate(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();

        $message = Message::factory()->create([
            'text' => 'Original message',
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ]);

        $updatedData = [
            'text' => 'Updated message text',
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ];

        $this->actingAs($sender)
            ->putJson("/api/messages/{$message->id}", $updatedData)
            ->assertOk()
            ->assertJson([
                'message' => 'Message updated successfully',
                'messageData' => [
                    'id' => $message->id,
                    'text' => 'Updated message text',
                ],
            ]);

        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'text' => 'Updated message text',
        ]);
    }

    public function testDestroy(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();

        $message = Message::factory()->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ]);

        $this->actingAs($sender, 'sanctum')
            ->deleteJson("/api/messages/{$message->id}")
            ->assertOk()
            ->assertJson([
                'message' => 'Message deleted successfully',
            ]);

        $this->assertDatabaseMissing('messages', [
            'id' => $message->id,
        ]);
    }
}
