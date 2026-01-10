<?php

namespace App\Models;

use Spark\Database\Model;

class Contact extends Model
{
    public static string $table = 'contacts';

    protected array $guarded = [];
}
