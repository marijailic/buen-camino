<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\User;
use App\Services\PusherService;
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

    // getByReceiver
    public function testShouldReturnAllMessagesBetweenAuthenticatedUserAndReceiver(): void
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

    // getAllReceivers
    public function testShouldReturnUniqueUserIdsFromConversationsExcludingAuthenticatedUser(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $userC = User::factory()->create();

        Message::factory()->create(['sender_id' => $this->user->id, 'receiver_id' => $userA->id]);
        Message::factory()->create(['sender_id' => $this->user->id, 'receiver_id' => $userB->id]);
        Message::factory()->create(['sender_id' => $userC->id, 'receiver_id' => $this->user->id]);
        Message::factory()->create(['sender_id' => $this->user->id, 'receiver_id' => $userA->id]);

        $response = $this->getJson(route('messages.getAllReceivers'));

        $response->assertOk()->assertJsonStructure(['receiver_ids']);

        $actualReceiverIds = $response->json('receiver_ids');
        $expectedReceiverIds = [$userA->id, $userB->id, $userC->id];

        $this->assertCount(3, $actualReceiverIds);
        $this->assertEqualsCanonicalizing($expectedReceiverIds, $actualReceiverIds);
    }

    // store
    public function testShouldStoreMessageAndTriggerPusherEvent(): void
    {
        $receiver = User::factory()->create();
        $messageText = fake()->paragraph();

        $messageData = [
            'text' => $messageText,
            'sender_id' => $this->user->id,
            'receiver_id' => $receiver->id,
        ];

        $this->mock(PusherService::class)
            ->shouldReceive('newChatMessage')
            ->once()
            ->withArgs(function ($id, $text, $senderId, $receiverId) use ($messageText) {
                return $text === $messageText
                    && $senderId === $this->user->id
                    && $receiverId !== null;
            });

        $response = $this->postJson(route('messages.store'), $messageData);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Message created successfully',
                'data' => [
                    'text' => $messageText,
                    'sender_id' => $this->user->id,
                    'receiver_id' => $receiver->id,
                ],
            ]);

        $this->assertDatabaseHas('messages', [
            'text' => $messageText,
            'sender_id' => $this->user->id,
            'receiver_id' => $receiver->id,
        ]);
    }

    // show
    public function testShouldRetrieveMessageByMessageId(): void
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

    // update
    public function testShouldUpdateMessageAndTriggerPusherEvent(): void
    {
        $msg = Message::factory()->create();

        $updatedText = fake()->paragraph();

        $updatedMsg = [
            'text' => $updatedText,
            'sender_id' => $msg->sender_id,
            'receiver_id' => $msg->receiver_id,
        ];

        $this->mock(PusherService::class)
            ->shouldReceive('updateChatMessage')
            ->once()
            ->withArgs(function ($id, $text, $senderId, $receiverId) use ($msg, $updatedText) {
                return $id === $msg->id
                    && $text === $updatedText
                    && $senderId === $msg->sender_id
                    && $receiverId === $msg->receiver_id;
            });

        $response = $this->putJson(
            route('messages.update', $msg->id),
            $updatedMsg
        );

        $response->assertOk()
            ->assertJson([
                'message' => 'Message updated successfully',
                'data' => [
                    'id' => $msg->id,
                    'text' => $updatedText,
                ],
            ]);

        $this->assertDatabaseHas('messages', [
            'id' => $msg->id,
            'text' => $updatedText,
        ]);
    }

    // destroy
    public function testShouldDeleteMessageAndTriggerPusherEvent(): void
    {
        $message = Message::factory()->create([
            'sender_id' => $this->user->id,
        ]);

        $this->mock(PusherService::class)
            ->shouldReceive('deleteChatMessage')
            ->once()
            ->withArgs(function ($id, $senderId, $receiverId) use ($message) {
                return $id === $message->id
                    && $senderId === $message->sender_id
                    && $receiverId === $message->receiver_id;
            });

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
