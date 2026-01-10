<?php

namespace App\Models;

use Spark\Database\Model;

class PipelinesStage extends Model
{
    public static string $table = 'pipelines_stages';

    protected array $guarded = [];
}
