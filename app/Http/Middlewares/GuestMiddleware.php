<?php

namespace App\Http\Middlewares;

use Spark\Contracts\Http\MiddlewareInterface;
use Spark\Http\Request;

class GuestMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, \Closure $next): mixed
    {
        if (!is_guest()) {
            abort(error: 403, message: __('You are already logged in. Please log out first.'));
        }

        return $next($request);
    }
}