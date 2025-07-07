<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use App\Services\CloudinaryService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
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

    // getByUser
    public function testShouldRetrieveUsersPostsWithResolvedImgUrl(): void
    {
        $postWithImage = Post::factory()->for($this->user)->create([
            'has_image' => true,
        ]);

        $postWithoutImage = Post::factory()->for($this->user)->create([
            'has_image' => false,
        ]);

        Post::factory()->count(2)->create();

        $this->mock(CloudinaryService::class)
            ->shouldReceive('getImageUrl')
            ->with($postWithImage->id)
            ->andReturn('https://fake.cloudinary.com/' . $postWithImage->id);

        $response = $this->getJson(
            route('posts.getByUser', $this->user->id)
        );

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment([
                'id' => $postWithImage->id,
                'image_url' => 'https://fake.cloudinary.com/' . $postWithImage->id,
            ])
            ->assertJsonFragment([
                'id' => $postWithoutImage->id,
                'image_url' => null,
            ]);
    }

    // store
    public function testShouldCreatePostWithOptionalImage(): void
    {
        $fakeImage = UploadedFile::fake()->image('test-image.jpg');

        $newPostData = [
            'text' => fake()->paragraph(),
            'user_id' => $this->user->id,
            'image' => $fakeImage,
        ];

        $this->mock(CloudinaryService::class)
            ->shouldReceive('storeImage')
            ->once()
            ->withArgs(function ($postId, $base64Image) {
                return is_string($postId) && is_string($base64Image);
            });

        $response = $this->postJson(route('posts.store'), $newPostData);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Post created successfully',
                'data' => [
                    'text' => $newPostData['text'],
                    'user_id' => $this->user->id,
                    'has_image' => true,
                ],
            ]);

        $this->assertDatabaseHas('posts', [
            'text' => $newPostData['text'],
            'user_id' => $this->user->id,
            'has_image' => true,
        ]);
    }

    // show
    public function testShouldRetrievePostWithResolvedImageUrl(): void
    {
        $post = Post::factory()->for($this->user)->create();

        $mockedImageUrl = 'https://fake.cloudinary.com/' . $post->id;

        $this->mock(CloudinaryService::class)
            ->shouldReceive('getImageUrl')
            ->once()
            ->with($post->id)
            ->andReturn($mockedImageUrl);

        $response = $this->getJson(route('posts.show', $post->id));

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $post->id,
                    'text' => $post->text,
                    'user_id' => $post->user_id,
                ],
                'imageUrl' => $mockedImageUrl,
            ]);
    }

    // update
    public function testShouldUpdatePostText(): void
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

    // destroy
    public function testShouldDeletePost(): void
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
