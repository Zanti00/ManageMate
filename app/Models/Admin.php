<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'organization_name',
        'organization_type',
        'organization_email',
        'description',
        'first_name',
        'middle_name',
        'last_name',
        'position_title',
        'contact_email',
        'phone_number',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the admin's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }

    /**
     * Get the admin's display name (first and last name).
     */
    public function getDisplayNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Scope to filter by organization type.
     */
    public function scopeByOrganizationType($query, $type)
    {
        return $query->where('organization_type', $type);
    }

    /**
     * Scope to filter active admins (you can add status column later).
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
