<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\MembershipPlan;
use App\Models\GymClass;
use App\Http\Controllers\GymClassController;
use App\Http\Controllers\TransactionController;

Route::get('/', function () {
    $plans = MembershipPlan::where('is_active', true)->get();

    return Inertia::render('welcome', [
        'plans' => $plans
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();
        $role = $user->role;

        $userCount = User::where('role', 'member')->count();
        $activeSubscriptions = Subscription::where('status', 'active')->count();
        $todayAttendance = Attendance::whereDate('check_in', now())->count();

        if ($role === 'admin') {
            $totalRevenue = Payment::where('status', 'completed')->sum('amount');

            // Get subscriptions data
            $subscriptions = Subscription::with(['user', 'membershipPlan'])
                ->latest()
                ->get()
                ->map(function ($subscription) {
                    return [
                        'id' => $subscription->id,
                        'user_name' => $subscription->user->name,
                        'plan_name' => $subscription->membershipPlan->name,
                        'start_date' => $subscription->start_date,
                        'end_date' => $subscription->end_date,
                        'status' => $subscription->status,
                        'created_at' => $subscription->created_at,
                    ];
                });

            // Get recent activities (combination of payments and subscription changes)
            $recentPayments = Payment::with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($payment) {
                    return [
                        'id' => 'pay_' . $payment->id,
                        'user_id' => $payment->user_id,
                        'user_name' => $payment->user->name,
                        'user_initials' => substr($payment->user->name, 0, 2),
                        'description' => $payment->user->name . ' made a payment of $' . $payment->amount,
                        'action_type' => 'payment',
                        'created_at' => $payment->created_at,
                        'time_ago' => $payment->created_at->diffForHumans(),
                    ];
                });

            $recentSubscriptions = Subscription::with('user', 'membershipPlan')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($subscription) {
                    $actionType = 'subscription';
                    $description = $subscription->user->name . ' subscribed to ' . $subscription->membershipPlan->name . ' plan';

                    if ($subscription->status === 'cancelled') {
                        $description = $subscription->user->name . ' cancelled membership';
                    } elseif ($subscription->status === 'expired') {
                        $description = $subscription->user->name . '\'s membership expired';
                    }

                    return [
                        'id' => 'sub_' . $subscription->id,
                        'user_id' => $subscription->user_id,
                        'user_name' => $subscription->user->name,
                        'user_initials' => substr($subscription->user->name, 0, 2),
                        'description' => $description,
                        'action_type' => $actionType,
                        'created_at' => $subscription->created_at,
                        'time_ago' => $subscription->created_at->diffForHumans(),
                    ];
                });

            // Combine and sort by created_at
            $recentActivities = $recentPayments->concat($recentSubscriptions)
                ->sortByDesc('created_at')
                ->take(4)
                ->values()
                ->toArray();

            return Inertia::render('admindashboard', [
                'stats' => [
                    'userCount' => $userCount,
                    'activeSubscriptions' => $activeSubscriptions,
                    'totalRevenue' => $totalRevenue,
                    'todayAttendance' => $todayAttendance,
                ],
                'subscriptions' => $subscriptions,
                'recentActivities' => $recentActivities
            ]);
        } elseif ($role === 'staff') {
            return Inertia::render('staffdashboard', [
                'stats' => [
                    'userCount' => $userCount,
                    'activeSubscriptions' => $activeSubscriptions,
                    'todayAttendance' => $todayAttendance,
                ]
            ]);
        } else {
            // Member dashboard
            $userSubscription = Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->with('membershipPlan')
                ->latest()
                ->first();

            // Hitung streak berdasarkan kehadiran
            $attendanceRecords = Attendance::where('user_id', $user->id)
                ->orderBy('check_in', 'desc')
                ->get();

            $streak = 0;
            $lastDate = null;

            if ($attendanceRecords->count() > 0) {
                $streak = 1;
                $lastDate = date('Y-m-d', strtotime($attendanceRecords[0]->check_in));

                for ($i = 1; $i < $attendanceRecords->count(); $i++) {
                    $currentDate = date('Y-m-d', strtotime($attendanceRecords[$i]->check_in));
                    $expectedDate = date('Y-m-d', strtotime($lastDate . ' -1 day'));

                    if ($currentDate == $expectedDate) {
                        $streak++;
                        $lastDate = $currentDate;
                    } else {
                        break;
                    }
                }
            }

            $userAttendance = [
                'total_visits' => Attendance::where('user_id', $user->id)->count(),
                'last_visit' => $attendanceRecords->first() ? $attendanceRecords->first()->check_in->format('M d, Y') : null,
                'streak' => $streak
            ];

            // Get upcoming classes
            $today = strtolower(date('l'));
            $tomorrow = strtolower(date('l', strtotime('+1 day')));
            $dayAfterTomorrow = strtolower(date('l', strtotime('+2 days')));

            $upcomingClasses = GymClass::where('is_active', true)
                ->whereIn('day_of_week', [$today, $tomorrow, $dayAfterTomorrow])
                ->orderBy('day_of_week')
                ->orderBy('start_time')
                ->take(3)
                ->get()
                ->map(function($class) use ($today, $tomorrow) {
                    $dateLabel = 'Today';
                    if (strtolower($class->day_of_week) === $tomorrow) {
                        $dateLabel = 'Tomorrow';
                    } elseif (strtolower($class->day_of_week) !== $today) {
                        $dateLabel = date('l', strtotime("next {$class->day_of_week}"));
                    }

                    return [
                        'id' => $class->id,
                        'name' => $class->name,
                        'instructor' => $class->instructor_name,
                        'time' => date('g:i A', strtotime($class->start_time)) . ' - ' . date('g:i A', strtotime($class->end_time)),
                        'day' => $dateLabel,
                        'description' => $class->description,
                    ];
                });

            // Get payment method
            $paymentMethod = Payment::where('user_id', $user->id)
                ->latest()
                ->first();

            return Inertia::render('dashboard', [
                'subscription' => $userSubscription ? [
                    'plan_name' => $userSubscription->membershipPlan->name,
                    'price' => $userSubscription->membershipPlan->price,
                    'next_billing_date' => $userSubscription->end_date->format('M d, Y'),
                    'status' => $userSubscription->status,
                ] : null,
                'attendance' => $userAttendance,
                'classes' => $upcomingClasses,
                'payment' => $paymentMethod ? [
                    'method' => $paymentMethod->payment_method,
                    'last_four' => '4242',
                    'exp_date' => '12/25',
                ] : null
            ]);
        }
    })->name('dashboard');


    Route::get('gym-classes', [GymClassController::class, 'index'])->name('gym-classes.index');
    Route::get('gym-classes/{gymClass}', [GymClassController::class, 'show'])->name('gym-classes.show');


    Route::post('gym-classes/{gymClass}/book', [GymClassController::class, 'book'])->name('gym-classes.book');
    Route::delete('gym-classes/{gymClass}/cancel', [GymClassController::class, 'cancelBooking'])->name('gym-classes.cancel');

    // only for staff and admin
    Route::middleware(['role:staff,admin'])->group(function () {
        Route::get('gym-classes/create', [GymClassController::class, 'create'])->name('gym-classes.create');
        Route::post('gym-classes', [GymClassController::class, 'store'])->name('gym-classes.store');
        Route::get('gym-classes/{gymClass}/edit', [GymClassController::class, 'edit'])->name('gym-classes.edit');
        Route::put('gym-classes/{gymClass}', [GymClassController::class, 'update'])->name('gym-classes.update');
        Route::delete('gym-classes/{gymClass}', [GymClassController::class, 'destroy'])->name('gym-classes.destroy');
    });
});

// Member quick menu route
Route::get('/member/quick-menu', [App\Http\Controllers\MemberController::class, 'quickMenu'])
    ->middleware(['auth', 'verified'])
    ->name('member.quick-menu');

Route::middleware(['auth'])->group(function () {
    // Member routes
    Route::get('/members', [App\Http\Controllers\MemberController::class, 'index'])->name('members.index')->middleware('role:admin,staff');
    Route::get('/members/create', [App\Http\Controllers\MemberController::class, 'create'])->name('members.create')->middleware('role:admin,staff');
    Route::post('/members', [App\Http\Controllers\MemberController::class, 'store'])->name('members.store')->middleware('role:admin,staff');
    Route::get('/members/{member}', [App\Http\Controllers\MemberController::class, 'show'])->name('members.show')->middleware('role:admin,staff');

    // Payment routes
    Route::get('/payments', [App\Http\Controllers\PaymentController::class, 'index'])->name('payments.index')->middleware('role:admin');
    Route::get('/payments/create', [App\Http\Controllers\PaymentController::class, 'create'])->name('payments.create');
    Route::post('/payments', [App\Http\Controllers\PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}', [App\Http\Controllers\PaymentController::class, 'show'])->name('payments.show');
    Route::post('/process-payment', [App\Http\Controllers\PaymentController::class, 'process'])->name('payments.process');

    // Transaction routes
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index')->middleware('role:admin');
    Route::get('/transactions/create', [TransactionController::class, 'create'])->name('transactions.create');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update')->middleware('role:admin');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
