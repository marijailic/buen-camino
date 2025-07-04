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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('messages')->truncate();
        DB::table('posts')->truncate();
        DB::table('users')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        User::factory()->create([
            'email' => 'example@example.com',
            'latitude' => 45.0950,    // Labin lat
            'longitude' => 14.1190,   // Labin lon
        ]);
    }
}
