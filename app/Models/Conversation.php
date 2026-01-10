<?php

namespace App\Models;

use Spark\Database\Model;

class Conversation extends Model
{
    public static string $table = 'conversations';

    protected array $guarded = [];
}
