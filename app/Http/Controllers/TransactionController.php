<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\MembershipPlan;
use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Show the form for creating a new transaction.
     */
    public function create()
    {
        $plans = MembershipPlan::where('is_active', true)->get();

        return Inertia::render('Transactions/Create', [
            'plans' => $plans
        ]);
    }

    /**
     * Store a newly created transaction in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'plan_name' => 'required|string',
            'amount' => 'required|numeric',
            'payment_method' => 'required|string|in:credit_card,bank_transfer',
        ]);

        // Find the plan by name
        $plan = MembershipPlan::where('name', $request->plan_name)->firstOrFail();

        // Create a new transaction with pending status
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'status' => 'pending', // Always set initial status as pending for admin approval
        ]);

        // Redirect back to dashboard with success message
        return redirect()->route('dashboard')->with('success', 'Pembayaran berhasil diproses dan sedang menunggu persetujuan');
    }

    /**
     * Update the specified transaction status.
     */
    public function update(Request $request, Transaction $transaction)
    {
        // Only admin can update transaction status
        if (Auth::user()->role !== 'admin') {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $transaction->update([
            'status' => $request->status
        ]);

        // If transaction is approved, create a subscription for the user
        if ($request->status === 'approved') {
            // Get the membership plan
            $plan = MembershipPlan::findOrFail($transaction->plan_id);

            // Create a new subscription
            $subscription = Subscription::create([
                'user_id' => $transaction->user_id,
                'membership_plan_id' => $transaction->plan_id,
                'start_date' => now(),
                'end_date' => now()->addDays($plan->duration_days),
                'status' => 'active'
            ]);

            // Create a payment record
            Payment::create([
                'user_id' => $transaction->user_id,
                'subscription_id' => $subscription->id,
                'amount' => $transaction->amount,
                'payment_method' => $transaction->payment_method,
                'transaction_id' => $transaction->id,
                'status' => 'completed',
                'payment_date' => now()
            ]);
        }

        return redirect()->back()->with('success', 'Status transaksi berhasil diperbarui');
    }

    /**
     * Display a listing of the transactions.
     */
    public function index()
    {
        // Only admin can view all transactions
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $transactions = Transaction::with(['user', 'plan'])->latest()->get();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions
        ]);
    }
}
