<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function testPostsByUser(): void
    {
        $posts = Post::factory()->count(2)->for($this->user)->create();
        Post::factory()->count(2)->create();

        $response = $this->getJson(
            route('posts.getByUser', $this->user->id)
        );

        $response->assertOk()
            ->assertJsonCount(2, 'data');

        $response->assertJsonFragment(['id' => $posts[0]->id]);
        $response->assertJsonFragment(['id' => $posts[1]->id]);
    }

    public function testStore(): void
    {
        $newPostData = [
            'text' => fake()->paragraph(),
            'user_id' => $this->user->id,
        ];

        $response = $this->postJson(route('posts.store'), $newPostData);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Post created successfully',
                'data' => [
                    'text' => $newPostData['text'],
                    'user_id' => $this->user->id,
                ],
            ]);

        $this->assertDatabaseHas('posts', [
            'text' => $newPostData['text'],
            'user_id' => $this->user->id,
        ]);
    }

    public function testShow(): void
    {
        $post = Post::factory()->for($this->user)->create();

        $response = $this->getJson(route('posts.show', $post->id));

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $post->id,
                    'text' => $post->text,
                    'user_id' => $post->user_id,
                ]
            ]);
    }

    public function testUpdate(): void
    {
        $post = Post::factory()->for($this->user)->create();
        $updatedPostData = [
            'text' => fake()->paragraph(),
        ];

        $response = $this->putJson(
            route('posts.update', $post->id), $updatedPostData
        );

        $response->assertOk()
            ->assertJson([
                'message' => 'Post updated successfully',
                'data' => [
                    'text' => $updatedPostData['text'],
                ],
            ]);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'text' => $updatedPostData['text'],
        ]);
    }

    public function testDestroy(): void
    {
        $post = Post::factory()->for($this->user)->create();

        $response = $this->deleteJson(route('posts.destroy', $post->id));

        $response->assertOk()
            ->assertJson([
                'message' => 'Post deleted successfully',
            ]);

        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
        ]);
    }
}
