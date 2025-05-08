<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendances = Attendance::with('user')
            ->latest()
            ->paginate(20);
            
        return Inertia::render('Attendance/Index', [
            'attendances' => $attendances
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $members = User::where('role', 'member')->get();
        
        return Inertia::render('Attendance/Create', [
            'members' => $members
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'check_in' => 'required|date',
            'check_out' => 'nullable|date|after:check_in',
        ]);
        
        $attendance = Attendance::create($validated);
        
        return redirect()->route('attendance.index')
            ->with('success', 'Attendance record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $attendance = Attendance::with('user')->findOrFail($id);
        
        return Inertia::render('Attendance/Show', [
            'attendance' => $attendance
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $attendance = Attendance::findOrFail($id);
        $members = User::where('role', 'member')->get();
        
        return Inertia::render('Attendance/Edit', [
            'attendance' => $attendance,
            'members' => $members
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $attendance = Attendance::findOrFail($id);
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'check_in' => 'required|date',
            'check_out' => 'nullable|date|after:check_in',
        ]);
        
        $attendance->update($validated);
        
        return redirect()->route('attendance.index')
            ->with('success', 'Attendance record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();
        
        return redirect()->route('attendance.index')
            ->with('success', 'Attendance record deleted successfully.');
    }
    
    /**
     * Record check-in for a user.
     */
    public function checkIn(User $user)
    {
        $existingAttendance = Attendance::where('user_id', $user->id)
            ->whereNull('check_out')
            ->first();
            
        if ($existingAttendance) {
            return back()->with('error', 'User is already checked in.');
        }
        
        Attendance::create([
            'user_id' => $user->id,
            'check_in' => now(),
        ]);
        
        return back()->with('success', 'Check-in recorded successfully.');
    }
    
    /**
     * Record check-out for a user.
     */
    public function checkOut(User $user)
    {
        $attendance = Attendance::where('user_id', $user->id)
            ->whereNull('check_out')
            ->latest()
            ->first();
            
        if (!$attendance) {
            return back()->with('error', 'No active check-in found for this user.');
        }
        
        $attendance->update([
            'check_out' => now(),
        ]);
        
        return back()->with('success', 'Check-out recorded successfully.');
    }
    
    /**
     * Show attendance history for the authenticated user.
     */
    public function myAttendance()
    {
        $attendances = Attendance::where('user_id', auth()->id())
            ->latest()
            ->paginate(20);
            
        return Inertia::render('Attendance/MyAttendance', [
            'attendances' => $attendances
        ]);
    }
}
