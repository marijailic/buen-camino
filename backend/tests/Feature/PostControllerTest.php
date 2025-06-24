<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function testIndex(): void
    {
        $user = User::factory()->create();
        $posts = Post::factory()->count(2)->for($user)->create();

        Post::factory()->count(2)->create();

        $response = $this->actingAs($user)->getJson('/api/posts');

        $response->assertStatus(200);
        $response->assertJsonCount(2);

        $response->assertJsonFragment(['id' => $posts[0]->id]);
        $response->assertJsonFragment(['id' => $posts[1]->id]);
    }

    public function testStore(): void
    {
        $user = User::factory()->create();

        $postData = [
            'text' => fake()->paragraph(),
            'user_id' => $user->id,
        ];

        $response = $this->actingAs($user)->postJson('/api/posts', $postData);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Post created successfully',
                'post' => [
                    'user_id' => $user->id,
                ],
            ]);

        $this->assertDatabaseHas('posts', $postData);
    }

    public function testShow(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $this->actingAs($user);

        $response = $this->getJson("/api/posts/{$post->id}");

        $response->assertOk()
            ->assertJsonStructure([
                'post' => [
                    'id',
                    'text',
                    'user_id',
                ]
            ])
            ->assertJsonFragment([
                'user_id' => $user->id,
            ]);
    }

    public function testUpdate(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $newData = [
            'text' => fake()->paragraph(),
        ];

        $this->actingAs($user)
            ->putJson("/api/posts/{$post->id}", $newData)
            ->assertOk()
            ->assertJsonStructure([
                'message',
                'post' => [
                    'text',
                ],
            ])
            ->assertJson([
                'message' => 'Post updated successfully',
                'post' => [
                    'text' => $newData['text'],
                ],
            ]);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'text' => $newData['text'],
        ]);
    }

    public function testDestroy(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $response = $this->actingAs($user)
            ->deleteJson("/api/posts/{$post->id}");

        $response->assertOk()
            ->assertJson([
                'message' => 'Post deleted successfully',
            ]);

        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
        ]);
    }
}
