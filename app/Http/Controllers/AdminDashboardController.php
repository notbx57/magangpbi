<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\ClassBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'userCount' => User::count(),
            'activeSubscriptions' => Subscription::where('status', 'active')->count(),
            'totalRevenue' => Transaction::where('status', 'approved')->sum('amount'),
            'todayAttendance' => 0, // Placeholder absen
        ];

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

        // Recent activities untuk admin dashboard
        $recentActivities = $this->getRecentActivities();

        return Inertia::render('AdminDashboard', [
            'stats' => $stats,
            'subscriptions' => $subscriptions,
            'recentActivities' => $recentActivities,
        ]);
    }

    /**
         * Get recent activities for the dashboard
         *
         * @return array
         */
        private function getRecentActivities()
        {
            // Get recent transactions
            $transactions = Transaction::with('user', 'plan')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($transaction) {
                    $actionType = 'payment';
                    $description = $transaction->user->name . ' made a payment of $' . $transaction->amount;

                    if ($transaction->plan) {
                        $description = $transaction->user->name . ' paid for ' . $transaction->plan->name . ' plan';
                    }

                    return [
                        'id' => 'txn_' . $transaction->id,
                        'user_id' => $transaction->user_id,
                        'user_name' => $transaction->user->name,
                        'user_initials' => $this->getInitials($transaction->user->name),
                        'description' => $description,
                        'action_type' => $actionType,
                        'created_at' => $transaction->created_at,
                        'time_ago' => $transaction->created_at->diffForHumans(),
                    ];
                });

            // Get recent subscription changes
            $subscriptions = Subscription::with('user', 'membershipPlan')
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
                        'user_initials' => $this->getInitials($subscription->user->name),
                        'description' => $description,
                        'action_type' => $actionType,
                        'created_at' => $subscription->created_at,
                        'time_ago' => $subscription->created_at->diffForHumans(),
                    ];
                });

            // Combine and sort by created_at
            $activities = $transactions->concat($subscriptions)
                ->sortByDesc('created_at')
                ->take(4)
                ->values()
                ->toArray();

            return $activities;
        }

        /**
         * Get initials from a name
         *
         * @param string $name
         * @return string
         */
        private function getInitials($name)
        {
            $words = explode(' ', $name);
            $initials = '';

            foreach ($words as $word) {
                $initials .= strtoupper(substr($word, 0, 1));
            }

            return substr($initials, 0, 2);
        }

        /**
         * Delete a user and all associated records
         *
         * @param Request $request
         * @param int $id
         * @return \Illuminate\Http\JsonResponse
         */
        public function deleteUser(Request $request, $id)
        {
            try {
                $user = User::findOrFail($id);

                // Don't allow admins to delete themselves
                if ($request->user()->id == $id) {
                    return response()->json(['message' => 'You cannot delete your own account'], 403);
                }

                // Start a database transaction to ensure all related records are deleted successfully
                DB::beginTransaction();

                try {
                    // Delete all related records
                    ClassBooking::where('user_id', $id)->delete();
                    Attendance::where('user_id', $id)->delete();
                    Payment::where('user_id', $id)->delete();
                    Subscription::where('user_id', $id)->delete();

                    // Delete the user
                    $user->delete();

                    // Commit the transaction if all deletions succeed
                    DB::commit();

                    return response()->json(['message' => 'User deleted successfully']);
                } catch (\Exception $e) {
                    // Rollback the transaction if any deletion fails
                    DB::rollback();
                    throw $e;
                }
            } catch (\Exception $e) {
                return response()->json(['message' => 'Failed to delete user: ' . $e->getMessage()], 500);
            }
        }
    }
