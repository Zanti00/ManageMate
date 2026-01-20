<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'superadmin@test.com'],
            [
                'first_name' => 'Super',
                'last_name' => 'User',
                'password' => 'password',
                'role' => 'superadmin',
            ]
        );
    }
}
