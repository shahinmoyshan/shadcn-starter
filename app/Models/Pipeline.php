<?php

namespace App\Models;

use Spark\Database\Model;

class Pipeline extends Model
{
    public static string $table = 'pipelines';

    protected array $guarded = [];
}
