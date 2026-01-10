<?php

namespace App\Models;

use Spark\Database\Model;

class Opportunity extends Model
{
    public static string $table = 'opportunities';

    protected array $guarded = [];
}
