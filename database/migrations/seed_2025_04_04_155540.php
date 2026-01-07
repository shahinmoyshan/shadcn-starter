<?php

use App\Models\User;
use App\Modules\Privileges;

return new class {
    public function up(): void
    {
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'email' => 'admin@mail.com',
                'password' => 'password',
                'privileges' => Privileges::list(false)->dot()->keys(),
            ]
        );
    }

    public function down(): void
    {
        User::delete(['username' => 'admin']);
    }
};