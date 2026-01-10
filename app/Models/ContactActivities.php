<?php

namespace App\Models;

use Spark\Database\Model;

class ContactActivities extends Model
{
    public static string $table = 'contacts_activities';

    protected array $guarded = [];
}
