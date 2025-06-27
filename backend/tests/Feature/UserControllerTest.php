<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
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

    public function testStore(): void
    {
        $newUserData = [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => fake()->password(10),
        ];

        $response = $this->postJson(route('users.store'), $newUserData);

        $response->assertCreated()
            ->assertJson([
                'message' => 'User created successfully',
                'data' => [
                    'first_name' => $newUserData['first_name'],
                    'last_name' => $newUserData['last_name'],
                    'email' => $newUserData['email'],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => $newUserData['email'],
        ]);
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
}
