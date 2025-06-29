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
    public function testShouldReturnUsersNearPulaWithinConfiguredDistance(): void
    {
        DB::table('users')->truncate();

        // Pula
        $authUser = User::factory()->create([
            'latitude' => 44.8666,
            'longitude' => 13.8496,
        ]);

        // Pula ~10km
        $nearbyUser = User::factory()->create([
            'latitude' => 44.9000,
            'longitude' => 13.8500,
            'updated_at' => now(),
        ]);

        // Zagreb
        $farUser = User::factory()->create([
            'latitude' => 45.8150,
            'longitude' => 15.9819,
            'updated_at' => now(),
        ]);

        $this->actingAs($authUser);

        $response = $this->getJson(route('users.index'));

        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['id' => $nearbyUser->id]);
        $response->assertJsonMissing(['id' => $farUser->id]);
    }

    public function testShow(): void
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

    public function testUpdate(): void
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

    public function testDestroySoftDeletesUser(): void
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

    public function testShouldUpdateUserLocation(): void
    {
        // Pula
        $user = User::factory()->create([
            'latitude' => 44.8666,
            'longitude' => 13.8496,
        ]);

        $this->actingAs($user);

        // Zagreb
        $newLocation = [
            'latitude' => 45.8150,
            'longitude' => 15.9819,
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
