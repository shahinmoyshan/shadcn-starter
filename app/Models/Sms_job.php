<?php

namespace App\Models;

use Spark\Database\Model;

class Sms_job extends Model
{
    public static string $table = 'sms_jobs';

    protected array $guarded = [];
}
