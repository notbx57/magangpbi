<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\MembershipPlan;
use App\Models\Subscription;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of the payments.
     */
    public function index()
    {
        // Only admin can view all payments
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $payments = Payment::with(['user', 'subscription.membershipPlan'])
            ->latest()
            ->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments
        ]);
    }

    /**
     * Show the form for creating a new payment.
     */
    public function create()
    {
        $plans = MembershipPlan::where('is_active', true)->get();

        return Inertia::render('Payments/Create', [
            'plans' => $plans
        ]);
    }

    /**
     * Store a newly created payment in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'plan_id' => 'required|exists:membership_plans,id',
            'payment_method' => 'required|string|in:credit_card,bank_transfer',
        ]);

        // Get the plan
        $plan = MembershipPlan::findOrFail($request->plan_id);

        // Create a transaction record
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'amount' => $plan->price,
            'payment_method' => $request->payment_method,
            'status' => 'pending',
        ]);

        // Redirect back to dashboard with success message
        return redirect()->route('dashboard')->with('success', 'Pembayaran berhasil diproses dan sedang menunggu persetujuan');
    }

    /**
     * Display the specified payment.
     */
    public function show(Payment $payment)
    {
        // Check if user is admin or the payment belongs to the user
        if (Auth::user()->role !== 'admin' && $payment->user_id !== Auth::id()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Payments/Show', [
            'payment' => $payment->load(['user', 'subscription.membershipPlan'])
        ]);
    }

    /**
     * Process a payment directly (for testing/development).
     */
    public function process(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'plan_name' => 'required|string',
            'payment_method' => 'required|string|in:credit_card,bank_transfer',
        ]);

        // Find the plan by name
        $plan = MembershipPlan::where('name', $request->plan_name)->firstOrFail();

        // Create a transaction with approved status (for direct processing)
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'amount' => $plan->price,
            'payment_method' => $request->payment_method,
            'status' => 'approved',
        ]);

        // Create a subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'membership_plan_id' => $plan->id,
            'start_date' => now(),
            'end_date' => now()->addDays($plan->duration_days),
            'status' => 'active'
        ]);

        // Create a payment record
        Payment::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'amount' => $plan->price,
            'payment_method' => $request->payment_method,
            'transaction_id' => $transaction->id,
            'status' => 'completed',
            'payment_date' => now()
        ]);

        return redirect()->route('dashboard')->with('success', 'Pembayaran berhasil diproses dan membership Anda telah aktif');
    }
}
