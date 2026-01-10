<?php

namespace App\Models;

use Spark\Database\Model;

class Form extends Model
{
    public static string $table = 'forms';

    protected array $guarded = [];
}
