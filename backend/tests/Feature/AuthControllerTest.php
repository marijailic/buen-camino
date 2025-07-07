<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use DatabaseTransactions;

    // register
    public function testShouldRegisterUser(): void
    {
        $newUserData = [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => fake()->password(10),
        ];

        $response = $this->postJson(route('register'), $newUserData);

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

    // login
    public function testShouldLogUserIn(): void
    {
        $password = 'password';
        $user = User::factory()->create([
            'password' => $password
        ]);

        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'access_token',
                'token_type'
            ])
            ->assertJson([
                'token_type' => 'Bearer'
            ]);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    // logout
    public function testShouldLogUserOut(): void
    {
        $user = User::factory()->create();
        $user->createToken('auth_token')->plainTextToken;

        $this->actingAs($user)->post(route('logout'))
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id
        ]);
    }
}
