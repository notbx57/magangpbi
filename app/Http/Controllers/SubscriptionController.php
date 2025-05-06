<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\MembershipPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subscriptions = Subscription::with(['user', 'membershipPlan'])
            ->latest()
            ->paginate(20);
            
        return Inertia::render('Subscriptions/Index', [
            'subscriptions' => $subscriptions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $members = User::where('role', 'member')->get();
        $plans = MembershipPlan::where('is_active', true)->get();
        
        return Inertia::render('Subscriptions/Create', [
            'members' => $members,
            'plans' => $plans
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_plan_id' => 'required|exists:membership_plans,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,expired,cancelled',
        ]);
        
        $subscription = Subscription::create($validated);
        
        return redirect()->route('subscriptions.index')
            ->with('success', 'Subscription created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $subscription = Subscription::with(['user', 'membershipPlan', 'payments'])
            ->findOrFail($id);
            
        return Inertia::render('Subscriptions/Show', [
            'subscription' => $subscription
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $subscription = Subscription::findOrFail($id);
        $members = User::where('role', 'member')->get();
        $plans = MembershipPlan::where('is_active', true)->get();
        
        return Inertia::render('Subscriptions/Edit', [
            'subscription' => $subscription,
            'members' => $members,
            'plans' => $plans
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $subscription = Subscription::findOrFail($id);
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_plan_id' => 'required|exists:membership_plans,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,expired,cancelled',
        ]);
        
        $subscription->update($validated);
        
        return redirect()->route('subscriptions.index')
            ->with('success', 'Subscription updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $subscription = Subscription::findOrFail($id);
        $subscription->delete();
        
        return redirect()->route('subscriptions.index')
            ->with('success', 'Subscription deleted successfully.');
    }
    
    /**
     * Display the current user's subscription.
     */
    public function mySubscription()
    {
        $user = auth()->user();
        
        $subscription = Subscription::with('membershipPlan')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->latest()
            ->first();
            
        $allSubscriptions = Subscription::with('membershipPlan')
            ->where('user_id', $user->id)
            ->latest()
            ->get();
            
        $availablePlans = MembershipPlan::where('is_active', true)->get();
        
        return Inertia::render('Subscriptions/MySubscription', [
            'currentSubscription' => $subscription,
            'subscriptionHistory' => $allSubscriptions,
            'availablePlans' => $availablePlans
        ]);
    }
}
