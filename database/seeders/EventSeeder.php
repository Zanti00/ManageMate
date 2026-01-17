<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        if (! $admin) {
            return;
        }

        $now = Carbon::now();

        $baseEvents = [
            [
                'title' => 'Campus Tech Expo',
                'description' => 'Hands-on technology showcase featuring student-led startups, robotics demos, and AI workshops.',
                'location' => 'Innovation Hall, 2nd Floor',
                'price' => 150.00,
                'start_date' => $now->copy()->addDays(14)->toDateString(),
                'end_date' => $now->copy()->addDays(15)->toDateString(),
                'start_time' => '09:00:00',
                'end_time' => '17:00:00',
                'registration_start_date' => $now->copy()->addDays(1)->toDateString(),
                'registration_end_date' => $now->copy()->addDays(13)->toDateString(),
                'registration_start_time' => '08:00:00',
                'registration_end_time' => '18:00:00',
                'attendees' => 120,
                'registries' => 150,
                'status' => 'pending',
                'earnings' => 18000,
                'is_featured' => true,
                'images' => ['events/tech-expo.jpg'],
            ],
            [
                'title' => 'Leadership & Strategy Summit',
                'description' => 'Two-day summit highlighting industry leaders, alumni, and breakout strategy sessions for student orgs.',
                'location' => 'Grand Ballroom, Convention Center',
                'price' => 200.00,
                'start_date' => $now->copy()->addDays(-1)->toDateString(),
                'end_date' => $now->copy()->addDays(1)->toDateString(),
                'start_time' => '08:30:00',
                'end_time' => '16:30:00',
                'registration_start_date' => $now->copy()->addDays(-20)->toDateString(),
                'registration_end_date' => $now->copy()->addDays(-2)->toDateString(),
                'registration_start_time' => '09:00:00',
                'registration_end_time' => '17:00:00',
                'attendees' => 250,
                'registries' => 280,
                'status' => 'active',
                'earnings' => 50000,
                'is_featured' => true,
                'images' => ['events/leadership-summit.jpg'],
            ],
            [
                'title' => 'Wellness & Sustainability Fair',
                'description' => 'Interactive booths on mental health, sustainability hacks, and local eco-friendly initiatives.',
                'location' => 'Central Campus Green',
                'price' => 75.00,
                'start_date' => $now->copy()->addDays(-30)->toDateString(),
                'end_date' => $now->copy()->addDays(-29)->toDateString(),
                'start_time' => '10:00:00',
                'end_time' => '15:00:00',
                'registration_start_date' => $now->copy()->addDays(-60)->toDateString(),
                'registration_end_date' => $now->copy()->addDays(-31)->toDateString(),
                'registration_start_time' => '07:30:00',
                'registration_end_time' => '19:00:00',
                'attendees' => 300,
                'registries' => 340,
                'status' => 'closed',
                'earnings' => 22500,
                'images' => ['events/wellness-fair.jpg'],
            ],
            [
                'title' => 'Creative Arts Weekend',
                'description' => 'Gallery walks, film screenings, and music showcases featuring cross-campus collaborations.',
                'location' => 'Arts & Media Center',
                'price' => 120.00,
                'start_date' => $now->copy()->addDays(7)->toDateString(),
                'end_date' => $now->copy()->addDays(8)->toDateString(),
                'start_time' => '11:00:00',
                'end_time' => '22:00:00',
                'registration_start_date' => $now->copy()->addDays(-5)->toDateString(),
                'registration_end_date' => $now->copy()->addDays(5)->toDateString(),
                'registration_start_time' => '09:00:00',
                'registration_end_time' => '18:30:00',
                'attendees' => 180,
                'registries' => 200,
                'status' => 'pending',
                'earnings' => 21600,
                'images' => ['events/creative-arts.jpg'],
            ],
            [
                'title' => 'Innovation Sprint Finals',
                'description' => 'Pitch day for the semester-long innovation sprint judged by venture partners.',
                'location' => 'Startup Incubation Lab',
                'price' => 0,
                'start_date' => $now->copy()->addDays(-10)->toDateString(),
                'end_date' => $now->copy()->addDays(-9)->toDateString(),
                'start_time' => '13:00:00',
                'end_time' => '18:00:00',
                'registration_start_date' => $now->copy()->addDays(-45)->toDateString(),
                'registration_end_date' => $now->copy()->addDays(-11)->toDateString(),
                'registration_start_time' => '10:00:00',
                'registration_end_time' => '20:00:00',
                'attendees' => 90,
                'registries' => 95,
                'status' => 'rejected',
                'earnings' => 0,
                'is_deleted' => true,
                'is_featured' => false,
                'images' => ['events/innovation-sprint.jpg'],
            ],
        ];

        $themes = [
            [
                'title' => 'Tech Connect Forum',
                'description' => 'Panel discussions with innovators, founders, and student-led labs exploring emerging technologies.',
                'location' => 'Innovation Hall',
                'image' => 'events/tech-connect.jpg',
            ],
            [
                'title' => 'Community Impact Drive',
                'description' => 'Volunteer partnerships, fundraisers, and neighborhood outreach initiatives.',
                'location' => 'City Civic Center',
                'image' => 'events/community-impact.jpg',
            ],
            [
                'title' => 'Culture Fest Live',
                'description' => 'Global cuisine, cultural dance exhibitions, and student heritage showcases.',
                'location' => 'Campus Quad',
                'image' => 'events/culture-fest.jpg',
            ],
            [
                'title' => 'Design Sprint Lab',
                'description' => 'Rapid prototyping workshop focused on solving real user problems with multidisciplinary teams.',
                'location' => 'Product Studio',
                'image' => 'events/design-sprint.jpg',
            ],
            [
                'title' => 'Wellness Retreat Series',
                'description' => 'Mindfulness sessions, nutrition clinics, and coach-led fitness assessments.',
                'location' => 'Wellness Pavilion',
                'image' => 'events/wellness-retreat.jpg',
            ],
        ];

        $statuses = ['pending', 'active', 'rejected', 'closed'];
        $generatedEvents = [];

        for ($i = 1; $i <= 100; $i++) {
            $theme = $themes[($i - 1) % count($themes)];
            $status = $statuses[($i - 1) % count($statuses)];
            $startDate = $now->copy()->addDays(-75 + $i);
            $endDate = $startDate->copy()->addDays(($i % 3) + 1);
            $registrationEndDate = $startDate->copy()->subDays(2);
            $registrationStartDate = $registrationEndDate->copy()->subDays(10 + ($i % 5));
            $attendees = 60 + (($i * 7) % 160);
            $registries = $attendees + (5 + ($i % 12));
            $price = 50 + (($i % 8) * 25);
            $isDeleted = $status === 'rejected' && $i % 10 === 0;
            $isFeatured = $status === 'active' && $i % 7 === 0;

            $generatedEvents[] = [
                'title' => sprintf('%s %02d', $theme['title'], $i),
                'description' => $theme['description'],
                'location' => $theme['location'],
                'price' => $price,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'start_time' => '09:00:00',
                'end_time' => '18:00:00',
                'registration_start_date' => $registrationStartDate->toDateString(),
                'registration_end_date' => $registrationEndDate->toDateString(),
                'registration_start_time' => '08:00:00',
                'registration_end_time' => '17:00:00',
                'attendees' => $attendees,
                'registries' => $registries,
                'status' => $status,
                'earnings' => $price * $attendees,
                'is_deleted' => $isDeleted,
                'is_featured' => $isFeatured,
                'images' => [$theme['image']],
            ];
        }

        $events = array_merge($baseEvents, $generatedEvents);

        foreach ($events as $event) {
            $images = $event['images'] ?? [];
            unset($event['images']);

            $payload = array_merge(
                $event,
                [
                    'user_id' => $admin->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'is_deleted' => $event['is_deleted'] ?? false,
                    'is_featured' => $event['is_featured'] ?? false,
                ],
            );

            DB::table('events')->updateOrInsert(
                [
                    'user_id' => $admin->id,
                    'title' => $event['title'],
                ],
                $payload,
            );

            $eventId = DB::table('events')
                ->where('user_id', $admin->id)
                ->where('title', $event['title'])
                ->value('id');

            if (! $eventId || empty($images)) {
                continue;
            }

            foreach ($images as $imagePath) {
                DB::table('event_images')->updateOrInsert(
                    [
                        'event_id' => $eventId,
                        'image_path' => $imagePath,
                    ],
                    [
                        'event_id' => $eventId,
                        'image_path' => $imagePath,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                );
            }
        }
    }
}
