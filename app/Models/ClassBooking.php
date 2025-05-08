<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'gym_class_id',
        'booking_date',
        'status'
    ];

    protected $casts = [
        'booking_date' => 'date',
    ];

    /**
     * Get the user that made the booking
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the class that was booked
     */
    public function gymClass()
    {
        return $this->belongsTo(GymClass::class);
    }
}
