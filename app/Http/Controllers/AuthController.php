<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spark\Http\Auth;
use Spark\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request, Auth $auth)
    {
        $input = $request->validate([
            'user' => 'required|string|min:4|max:100',
            'password' => 'required|string|min:8|max:100',
            'remember_me' => 'nullable|boolean',
        ]);

        $user = User::where('username', $input->safe('user'))
            ->orWhere('email', $input->safe('user'))
            ->first();

        if (!$user) {
            return json([
                'success' => false,
                'errors' => ['user' => [__('User does not exists with this username or email.')]],
            ], 404);
        }

        if (!passcode($input->password, $user->password)) {
            return json([
                'success' => false,
                'errors' => ['password' => [__('Incorrect password.')]],
            ], 401);
        }

        $auth->login($user, $input->boolean('remember_me')); // Log the user in

        return [
            'success' => true,
            'message' => __('Login successful.'),
            'user' => user(),
        ];
    }

    public function logout(Auth $auth)
    {
        $auth->logout();

        return [
            'success' => true,
            'message' => __('Logout successful.'),
        ];
    }
}
