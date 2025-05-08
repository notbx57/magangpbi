<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Attendance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class SampleMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create member user
        $user = User::create([
            'name' => 'John Member',
            'email' => 'member@gym.com',
            'password' => Hash::make('password'),
            'role' => 'member',
            'email_verified_at' => now(),
            'phone_number' => '555-123-4567',
            'date_of_birth' => now()->subYears(25),
            'address' => '123 Fitness St, Exercise City',
            'emergency_contact' => 'Jane Member',
            'emergency_contact_phone' => '555-987-6543',
        ]);

        // Create subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'membership_plan_id' => 2, // Premium plan
            'start_date' => now(),
            'end_date' => now()->addDays(30),
            'status' => 'active',
        ]);

        // Create payment
        Payment::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'amount' => 15.99,
            'payment_method' => 'Credit Card',
            'transaction_id' => 'trx_' . uniqid(),
            'status' => 'completed',
            'payment_date' => now(),
        ]);

        // Create attendance records (recent visits with streak)
        $dates = [
            now()->subDays(4),
            now()->subDays(3),
            now()->subDays(2),
            now()->subDays(1),
            now(),
        ];

        foreach ($dates as $date) {
            Attendance::create([
                'user_id' => $user->id,
                'check_in' => $date->setTime(9, 0, 0),
                'check_out' => $date->setTime(10, 30, 0),
            ]);
        }
    }
}
