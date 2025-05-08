<?php

namespace App\Http\Controllers;

use App\Models\GymClass;
use App\Models\ClassBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GymClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes = GymClass::latest()->paginate(10);
        
        // Check if user is logged in
        $user = auth()->user();
        $role = $user->role ?? 'guest';
        
        // Get user's booked classes if they're logged in
        $bookedClassIds = [];
        if ($user) {
            $bookedClassIds = ClassBooking::where('user_id', $user->id)
                ->pluck('gym_class_id')
                ->toArray();
        }
        
        return Inertia::render('GymClasses/Index', [
            'classes' => $classes,
            'userRole' => $role,
            'bookedClassIds' => $bookedClassIds
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('GymClasses/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructor_name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'capacity' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);
        
        $class = GymClass::create($validated);
        
        return redirect()->route('gym-classes.index')
            ->with('success', 'Class created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(GymClass $gymClass)
    {
        // Check if the user has booked this class
        $user = auth()->user();
        $isBooked = false;
        
        if ($user) {
            $isBooked = ClassBooking::where('user_id', $user->id)
                ->where('gym_class_id', $gymClass->id)
                ->exists();
        }
        
        // Get current booking count
        $bookingsCount = ClassBooking::where('gym_class_id', $gymClass->id)->count();
        
        return Inertia::render('GymClasses/Show', [
            'class' => $gymClass,
            'isBooked' => $isBooked,
            'bookingsCount' => $bookingsCount,
            'availableSpots' => $gymClass->capacity - $bookingsCount,
            'userRole' => $user->role ?? 'guest',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GymClass $gymClass)
    {
        return Inertia::render('GymClasses/Edit', [
            'class' => $gymClass
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GymClass $gymClass)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructor_name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'capacity' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);
        
        $gymClass->update($validated);
        
        return redirect()->route('gym-classes.index')
            ->with('success', 'Class updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GymClass $gymClass)
    {
        $gymClass->delete();
        
        return redirect()->route('gym-classes.index')
            ->with('success', 'Class deleted successfully.');
    }
    
    /**
     * Book a class for the authenticated user.
     */
    public function book(GymClass $gymClass)
    {
        $user = auth()->user();
        
        // Check if user has already booked this class
        $existingBooking = ClassBooking::where('user_id', $user->id)
            ->where('gym_class_id', $gymClass->id)
            ->first();
            
        if ($existingBooking) {
            return redirect()->back()->with('error', 'You have already booked this class!');
        }
        
        // Check if class is at capacity
        $bookingsCount = ClassBooking::where('gym_class_id', $gymClass->id)->count();
        if ($bookingsCount >= $gymClass->capacity) {
            return redirect()->back()->with('error', 'This class is already at full capacity!');
        }
        
        // Create the booking
        ClassBooking::create([
            'user_id' => $user->id,
            'gym_class_id' => $gymClass->id,
            'booking_date' => now(),
            'status' => 'booked'
        ]);
        
        return redirect()->back()->with('success', 'Class booked successfully!');
    }
    
    /**
     * Cancel a class booking for the authenticated user.
     */
    public function cancelBooking(GymClass $gymClass)
    {
        $user = auth()->user();
        
        $booking = ClassBooking::where('user_id', $user->id)
            ->where('gym_class_id', $gymClass->id)
            ->first();
            
        if (!$booking) {
            return redirect()->back()->with('error', 'You do not have a booking for this class!');
        }
        
        $booking->delete();
        
        return redirect()->back()->with('success', 'Class booking cancelled successfully!');
    }
} 