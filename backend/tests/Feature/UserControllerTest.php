<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // index
    public function testShouldRetrieveNearbyUsersWithinConfiguredDistance(): void
    {
        DB::table('users')->truncate();

        // Pula
        $authUser = User::factory()->create([
            'latitude' => 44.8683,
            'longitude' => 13.8480,
        ]);

        // Pula ~10km
        $nearbyUser = User::factory()->create([
            'latitude' => 44.9000,
            'longitude' => 13.8500,
            'updated_at' => now(),
        ]);

        // Zagreb
        $farUser = User::factory()->create([
            'latitude' => 45.8153,
            'longitude' => 15.9665,
            'updated_at' => now(),
        ]);

        $this->actingAs($authUser);

        $response = $this->getJson(route('users.index'));

        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['id' => $nearbyUser->id]);
        $response->assertJsonMissing(['id' => $farUser->id]);
    }

    // show
    public function testShouldRetrieveUserById(): void
    {
        $response = $this->actingAs($this->user)
            ->getJson(route('users.show', $this->user->id));

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $this->user['id'],
                ],
            ]);
    }

    // update
    public function testShouldUpdateUsersEmail(): void
    {
        $updatedUserData = [
            'email' => fake()->unique()->safeEmail(),
        ];

        $response = $this->actingAs($this->user)
            ->putJson(route('users.update', $this->user->id), $updatedUserData);

        $response->assertOk()
            ->assertJson([
                'message' => 'User updated successfully',
                'data' => [
                    'email' => $updatedUserData['email'],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'first_name' => $this->user['first_name'],
            'last_name' => $this->user['last_name'],
            'email' => $updatedUserData['email'],
        ]);
    }

    // destroy
    public function testShouldSoftDeleteUser(): void
    {
        $response = $this->actingAs($this->user)
            ->deleteJson(route('users.destroy', $this->user->id));

        $response->assertOk()
            ->assertJson([
                'message' => 'User deleted successfully',
            ]);

        $this->assertSoftDeleted('users', [
            'id' => $this->user->id,
        ]);
    }

    // updateLocation
    public function testShouldUpdateUserLocation(): void
    {
        // Pula
        $user = User::factory()->create([
            'latitude' => 44.8683,
            'longitude' => 13.8480,
        ]);

        $this->actingAs($user);

        // Zagreb
        $newLocation = [
            'latitude' => 45.8153,
            'longitude' => 15.9665,
        ];

        $response = $this->postJson(route('users.updateLocation'), $newLocation);

        $response
            ->assertOk()
            ->assertJson([
            'message' => 'User location updated successfully',
            'data' => [
                'id' => $user->id,
                'latitude' => $newLocation['latitude'],
                'longitude' => $newLocation['longitude'],
            ],
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'latitude' => $newLocation['latitude'],
            'longitude' => $newLocation['longitude'],
        ]);
    }
}
