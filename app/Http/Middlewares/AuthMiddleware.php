<?php

namespace App\Http\Middlewares;

use Spark\Contracts\Http\MiddlewareInterface;
use Spark\Http\Request;

class AuthMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, \Closure $next): mixed
    {
        if (is_guest()) {
            abort(error: 401, message: __('Unauthorized access. Please log in.'));
        }

        return $next($request);
    }
}