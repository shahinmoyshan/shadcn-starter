<?php

use App\Models\User;

return new class {
    public function up(): void
    {
        User::create([
            'username' => 'admin',
            'email' => 'admin@mail.com',
            'password' => passcode('password'),
        ]);
    }

    public function down(): void
    {
        User::delete(['username' => 'admin']);
    }
};