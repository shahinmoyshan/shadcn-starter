<?php

namespace App\Models;

use Spark\Database\Model;

class SmsTemplate extends Model
{
    public static string $table = 'sms_templates';

    protected array $guarded = [];
}
