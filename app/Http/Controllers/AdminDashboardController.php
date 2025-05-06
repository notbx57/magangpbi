<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'userCount' => User::count(),
            'activeSubscriptions' => User::whereNotNull('membership_plan_id')->count(),
            'totalRevenue' => Transaction::where('status', 'approved')->sum('amount'),
            'todayAttendance' => 0, // This would need to be implemented based on your attendance tracking system
        ];

        $transactions = Transaction::with(['user', 'plan'])
            ->latest()
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'user_name' => $transaction->user->name,
                    'plan_name' => $transaction->plan->name,
                    'amount' => $transaction->amount,
                    'payment_method' => $transaction->payment_method,
                    'status' => $transaction->status,
                    'created_at' => $transaction->created_at,
                ];
            });

        return Inertia::render('AdminDashboard', [
            'stats' => $stats,
            'transactions' => $transactions,
        ]);
    }
} 