<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
