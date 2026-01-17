<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = [
            [
                'name' => 'Tech Innovators Guild',
                'abbreviation' => 'TIG',
                'type' => 'Technology',
                'email' => 'contact@tig.org',
                'address' => '123 Innovation Drive, Metro City',
            ],
            [
                'name' => 'Health Access Network',
                'abbreviation' => 'HAN',
                'type' => 'Healthcare',
                'email' => 'hello@han.org',
                'address' => '456 Wellness Avenue, Lakeside',
            ],
            [
                'name' => 'Education First Alliance',
                'abbreviation' => 'EFA',
                'type' => 'Education',
                'email' => 'info@efa.org',
                'address' => '789 Learning Street, Hilltown',
            ],
        ];

        foreach ($organizations as $organization) {
            DB::table('organizations')->updateOrInsert(
                ['email' => $organization['email']],
                array_merge(
                    $organization,
                    [
                        'is_deleted' => false,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ],
                ),
            );
        }
    }
}
