<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subscription;
use App\Models\MembershipPlan;
use App\Models\Payment;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userCount = User::where('role', 'member')->count();
        $activeSubscriptions = Subscription::where('status', 'active')->count();
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        $todayAttendance = Attendance::whereDate('check_in', now())->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'userCount' => $userCount,
                'activeSubscriptions' => $activeSubscriptions,
                'totalRevenue' => $totalRevenue,
                'todayAttendance' => $todayAttendance,
            ]
        ]);
    }
}
