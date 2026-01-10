<?php

namespace App\Models;

use Spark\Database\Model;

class EmailJob extends Model
{
    public static string $table = 'email_jobs';

    protected array $guarded = [];
}
