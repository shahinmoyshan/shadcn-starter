<?php

namespace App\Models;

use Spark\Database\Model;

class Option extends Model
{
    public static string $table = 'options';

    protected array $guarded = [];
}
