<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subscription;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MemberController extends Controller
{
    public function index()
    {
        $members = User::where('role', 'member')
            ->with('subscriptions.membershipPlan')
            ->latest()
            ->paginate(10);

        return Inertia::render('Members/Index', [
            'members' => $members
        ]);
    }

    public function create()
    {
        // Get membership plans for the dropdown
        $membershipPlans = \App\Models\MembershipPlan::where('is_active', true)->get();

        return Inertia::render('Members/Create', [
            'membershipPlans' => $membershipPlans
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'membership_plan_id' => 'nullable|exists:membership_plans,id',
        ]);

        // Create the user with member role
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'role' => 'member',
        ]);

        // If a membership plan was selected, create a subscription
        if ($request->membership_plan_id) {
            $plan = \App\Models\MembershipPlan::findOrFail($request->membership_plan_id);

            // Create subscription
            Subscription::create([
                'user_id' => $user->id,
                'membership_plan_id' => $plan->id,
                'start_date' => now(),
                'end_date' => now()->addMonths($plan->duration_months),
                'status' => 'active',
            ]);
        }

        return redirect()->route('members.index')->with('success', 'Member created successfully');
    }

    public function show($id)
    {
        $member = User::with([
            'subscriptions.membershipPlan',
            'payments',
            'attendances' => function($query) {
                $query->latest()->take(10);
            }
        ])->findOrFail($id);

        return Inertia::render('Members/Show', [
            'member' => $member
        ]);
    }

    public function quickMenu()
    {
        $user = Auth::user();

        // Get user's active subscription
        $subscription = Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('membershipPlan')
            ->latest()
            ->first();

        // Get recent attendance
        $recentAttendance = Attendance::where('user_id', $user->id)
            ->latest()
            ->first();

        // Get upcoming classes
        $today = strtolower(date('l'));
        $upcomingClasses = \App\Models\GymClass::where('is_active', true)
            ->where('day_of_week', $today)
            ->orderBy('start_time')
            ->take(2)
            ->get();

        return Inertia::render('MemberQuickMenu', [
            'subscription' => $subscription ? [
                'plan_name' => $subscription->membershipPlan->name,
                'status' => $subscription->status,
                'end_date' => $subscription->end_date->format('M d, Y'),
            ] : null,
            'attendance' => [
                'last_visit' => $recentAttendance ? $recentAttendance->check_in->format('M d, Y') : null,
            ],
            'classes' => $upcomingClasses->map(function($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'time' => date('g:i A', strtotime($class->start_time)),
                    'instructor' => $class->instructor_name,
                ];
            }),
        ]);
    }
}
