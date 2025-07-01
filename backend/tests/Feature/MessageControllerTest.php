<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MessageControllerTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function testMessagesByReceiver(): void
    {
        $receiver = User::factory()->create();

        Message::factory()->count(5)->create([
            'sender_id' => $this->user->id,
            'receiver_id' => $receiver->id,
        ]);

        Message::factory()->count(3)->create([
            'sender_id' => $receiver->id,
            'receiver_id' => $this->user->id,
        ]);

        Message::factory()->count(4)->create();

        $responseData = $this
            ->getJson(route('messages.getByReceiver', $receiver->id))
            ->assertOk()
            ->assertJsonCount(8)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'sender_id',
                    'receiver_id',
                    'text',
                ],
            ])
            ->json();

        foreach ($responseData as $msg) {
            $this->assertTrue(
                $msg['sender_id'] === $this->user->id || $msg['receiver_id'] === $this->user->id
            );
        }
    }

    public function testShouldReturnAllReceiverIdsExcludingAuthenticatedUser(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $userC = User::factory()->create();

        Message::factory()->create([
            'sender_id' => $this->user->id,
            'receiver_id' => $userA->id,
        ]);

        Message::factory()->create([
            'sender_id' => $this->user->id,
            'receiver_id' => $userB->id,
        ]);

        Message::factory()->create([
            'sender_id' => $userC->id,
            'receiver_id' => $this->user->id,
        ]);

        Message::factory()->create([
            'sender_id' => $this->user->id,
            'receiver_id' => $userA->id,
        ]);

        $response = $this->getJson(
            route('messages.getAllReceivers')
        );

        $response
            ->assertOk()
            ->assertJsonStructure([
            'receiver_ids'
        ]);

        $receiverIds = $response->json('receiver_ids');

        $expectedIds = [
            $userA->id,
            $userB->id,
            $userC->id,
        ];

        $this->assertCount(3, $receiverIds);
        $this->assertEqualsCanonicalizing($expectedIds, $receiverIds);
    }

    public function testStore(): void
    {
        $receiver = User::factory()->create();
        $message = fake()->paragraph;

        $newMsgData = [
            'text' => $message,
            'sender_id' => $this->user->id,
            'receiver_id' => $receiver->id,
        ];

        $response = $this->postJson(route('messages.store'), $newMsgData);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Message created successfully',
                'data' => [
                    'text' => $message,
                    'sender_id' => $this->user->id,
                    'receiver_id' => $receiver->id,
                ],
            ]);

        $this->assertDatabaseHas('messages', [
            'text' => $message,
            'sender_id' => $this->user->id,
            'receiver_id' => $receiver->id,
        ]);
    }

    public function testShow(): void
    {
        $message = Message::factory()->create([
            'sender_id' => $this->user->id,
        ]);

        $response = $this->getJson(route('messages.show', $message->id));

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $message->id,
                    'text' => $message->text,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                ],
                ]);
    }

    public function testUpdate(): void
    {
        $msg = Message::factory()->create();
        $updatedMsg = [
            'text' => fake()->paragraph(),
            'sender_id' => $msg->sender_id,
            'receiver_id' => $msg->receiver_id,
        ];

        $response = $this->putJson(
            route('messages.update', $msg->id), $updatedMsg
        );

        $response->assertOk()
            ->assertJson([
                'message' => 'Message updated successfully',
                'data' => [
                    'id' => $msg->id,
                    'text' => $updatedMsg['text'],
                ],
            ]);

        $this->assertDatabaseHas('messages', [
            'id' => $msg->id,
            'text' => $updatedMsg['text'],
        ]);
    }

    public function testDestroy(): void
    {
        $message = Message::factory()->create([
            'sender_id' => $this->user->id,
        ]);

        $response = $this->deleteJson(
            route('messages.destroy', $message->id)
        );

        $response->assertOk()
            ->assertJson([
                'message' => 'Message deleted successfully',
            ]);

        $this->assertDatabaseMissing('messages', [
            'id' => $message->id,
        ]);
    }
}
