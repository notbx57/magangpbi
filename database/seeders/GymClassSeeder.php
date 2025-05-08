<?php

namespace Database\Seeders;

use App\Models\GymClass;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class GymClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            [
                'name' => 'HIIT Workout',
                'description' => 'High-intensity interval training to boost your fitness and burn calories.',
                'instructor_name' => 'John Smith',
                'start_time' => '18:00:00',
                'end_time' => '19:00:00',
                'day_of_week' => 'Monday',
                'capacity' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'Yoga Class',
                'description' => 'Relaxing yoga session to improve flexibility and reduce stress.',
                'instructor_name' => 'Sarah Johnson',
                'start_time' => '10:00:00',
                'end_time' => '11:00:00',
                'day_of_week' => 'Tuesday',
                'capacity' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Zumba Session',
                'description' => 'Fun dance-based workout to Latin rhythms.',
                'instructor_name' => 'Maria Rodriguez',
                'start_time' => '17:30:00',
                'end_time' => '18:30:00',
                'day_of_week' => 'Wednesday',
                'capacity' => 25,
                'is_active' => true,
            ],
            [
                'name' => 'Spin Class',
                'description' => 'High-energy cycling workout to build endurance and strength.',
                'instructor_name' => 'Mike Wilson',
                'start_time' => '19:30:00',
                'end_time' => '20:30:00',
                'day_of_week' => 'Thursday',
                'capacity' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'Boxing Fundamentals',
                'description' => 'Learn boxing techniques while getting a full-body workout.',
                'instructor_name' => 'Alex Thompson',
                'start_time' => '18:00:00',
                'end_time' => '19:00:00',
                'day_of_week' => 'Friday',
                'capacity' => 15,
                'is_active' => true,
            ],
        ];

        foreach ($classes as $class) {
            GymClass::create($class);
        }
    }
}
