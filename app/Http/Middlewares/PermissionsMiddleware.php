<?php

namespace App\Http\Middlewares;

use Spark\Contracts\Http\MiddlewareInterface;
use Spark\Http\Request;

class PermissionsMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, \Closure $next, ...$privileges): mixed
    {
        authorize('permission', $privileges);

        return $next($request);
    }
}
