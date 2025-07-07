<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'email' => 'example@example.com',
            'latitude' => 45.0892,    // Labin lat
            'longitude' => 14.1197,   // Labin lon
        ]);
    }
}
