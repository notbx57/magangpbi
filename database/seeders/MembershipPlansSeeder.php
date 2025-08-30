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
                'id' => 1,
                'name' => 'Basic',
                'description' => 'Akses Basic ke semua fitur gym',
                'price' => 4.99,
                'duration_days' => 30,
                'is_active' => true,
            ],
            [
                'id' => 2,
                'name' => 'Premium',
                'description' => 'Akses penuh ke kelas gym dan grup discord',
                'price' => 15.99,
                'duration_days' => 30,
                'is_active' => true,
            ],
            [
                'id' => 3,
                'name' => 'GymBro',
                'description' => 'Akses penuh ke kelas gym dan grup discord dengan personal trainer.',
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
