<?php

namespace App\Models;

use Spark\Database\Model;

/**
 * Class User
 * 
 * This class represents the User model. It extends the
 * base Model class from the Spark framework.
 * 
 * @package App\Models
 */
class User extends Model
{
    public static string $table = 'users';

    protected array $guarded = [];
    protected array $hidden = ['password'];
    protected array $appends = ['avatar_url', 'display_name', 'joined_at'];
    protected array $casts = [
        'password' => 'hashed',
        'privileges' => 'collection',
    ];

    public function getDisplayNameAttribute(): string
    {
        if (!empty($this->attributes['first_name'])) {
            return trim($this->attributes['first_name'] . ' ' . ($this->attributes['last_name'] ?? ''));
        }

        return $this->attributes['username'];
    }

    public function getAvatarUrlAttribute(): string
    {
        return get_gravatar_url($this->attributes['email'] ?? '', 100);
    }

    public function getJoinedAtAttribute(): string
    {
        return carbon($this->attributes['created_at'])->toFormattedDateString();
    }
}

