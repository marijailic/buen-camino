<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'email' => 'testuser@test.com',
            'latitude' => 44.9620,    // Vodnjan lat
            'longitude' => 13.8547,   // Vodnjan lon
        ]);
    }
}
