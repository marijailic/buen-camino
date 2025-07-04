<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'email' => 'example@example.com',
            'latitude' => 45.0950,    // Labin lat
            'longitude' => 14.1190,   // Labin lon
        ]);
    }
}
