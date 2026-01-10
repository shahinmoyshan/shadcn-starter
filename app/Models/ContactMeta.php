<?php

namespace App\Models;

use Spark\Database\Model;

class ContactMeta extends Model
{
    public static string $table = 'contacts_meta';

    protected array $guarded = [];
}
