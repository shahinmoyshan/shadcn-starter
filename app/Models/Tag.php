<?php

namespace App\Models;

use Spark\Database\Model;

class Tag extends Model
{
    public static string $table = 'tags';

    protected array $guarded = [];
}
