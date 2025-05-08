<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GymClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'instructor_name',
        'start_time',
        'end_time',
        'day_of_week',
        'capacity',
        'is_active'
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'is_active' => 'boolean'
    ];

    /**
     * Get the bookings for this class
     */
    public function bookings()
    {
        return $this->hasMany(ClassBooking::class);
    }

    /**
     * Get the users who booked this class
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'class_bookings');
    }
}
