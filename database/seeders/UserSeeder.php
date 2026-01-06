<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User::factory()->count(10)->create();

        User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'first_name' => 'Test',
                'last_name' => 'User',
                'password' => 'password',
                'year_level' => 1,
                'program' => 'Bachelor of Science in Information Technology (BSIT)',
                'email_verified_at' => now(),
            ]
        );
    }
}
