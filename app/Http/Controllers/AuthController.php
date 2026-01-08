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

    public function profile(Request $request)
    {
        $input = $request->validate([
            'action' => 'in:general,password',
            'first_name' => 'string|min:4|max:100',
            'last_name' => 'string|min:4|max:100',
            'username' => 'required_if:action,general|string|min:4|max:50|unique:users,username,' . user('id'),
            'email' => 'required_if:action,general|email|max:100|unique:users,email,' . user('id'),
            'current_password' => 'required_if:action,password|string|min:8|max:100',
            'password' => 'required_if:action,password|string|min:8|max:100|confirmed',
        ]);

        $user = user();
        if ($input->text('action') === 'general') {
            $user->fill($input->only(['first_name', 'last_name', 'username', 'email']));
            $user->save();

            return [
                'success' => true,
                'message' => __('Profile updated successfully.'),
                'user' => $user,
            ];
        } elseif ($input->text('action') === 'password') {
            if (!passcode($input->safe('current_password'), $user->password)) {
                return json([
                    'success' => false,
                    'errors' => ['current_password' => [__('Current password is incorrect.')]],
                ], 401);
            }

            $user->set('password', $input->password(hash: true));
            $user->save();

            return [
                'success' => true,
                'message' => __('Password updated successfully.'),
            ];
        }

        return json([
            'success' => false,
            'errors' => ['action' => [__('Invalid action.')]],
        ], 400);
    }
}
