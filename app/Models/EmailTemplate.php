<?php

namespace App\Models;

use Spark\Database\Model;

class EmailTemplate extends Model
{
    public static string $table = 'email_templates';

    protected array $guarded = [];
}
