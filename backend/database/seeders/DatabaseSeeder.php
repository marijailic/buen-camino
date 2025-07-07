<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'email' => 'uservodnjan@test.com',
            'latitude' => 44.9620,    // Vodnjan lat
            'longitude' => 13.8547,   // Vodnjan lon
        ]);

        User::factory()->create([
            'email' => 'useropatija@test.com',
            'latitude' => 45.3391,    // Opatija lat
            'longitude' => 14.3083,   // Opatija lon
        ]);

        User::factory()->create([
            'email' => 'usergorica@test.com',
            'latitude' => 45.7000,    // Gorica lat
            'longitude' => 16.0833,   // Gorica lon
        ]);
    }
}
