<?php

namespace Database\Seeders;

use App\Models\MembershipPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MembershipPlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Basic',
                'description' => 'Basic access to gym facilities during standard hours.',
                'price' => 4.99,
                'duration_days' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Premium',
                'description' => 'Full access to gym facilities and group classes.',
                'price' => 15.99,
                'duration_days' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'GymBro',
                'description' => 'Full 24/7 access to all facilities with personal trainer sessions.',
                'price' => 29.99,
                'duration_days' => 30,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            MembershipPlan::create($plan);
        }
    }
}
