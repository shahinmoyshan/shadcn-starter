<?php

use App\Models\User;

return new class {
    public function up(): void
    {
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'email' => 'admin@mail.com',
                'password' => passcode('password'),
                'privileges' => \App\Modules\Privileges::list(false)->dot()->keys(),
            ]
        );
    }

    public function down(): void
    {
        User::delete(['username' => 'admin']);
    }
};