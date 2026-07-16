<?php

namespace DolphinMicroservice\Http\Middleware;


use Closure;
use DolphinMicroservice\Repositories\DolphinAuth;
use DolphinMicroservice\Repositories\DolphinRepository;
use Illuminate\Http\Request;

use Symfony\Component\HttpFoundation\Response;

class DolphinMiddleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (empty($token)) {
            return $this->unauthorize();
        }

        $dolphin = new DolphinRepository();

        $res = $dolphin->verify($token);

        if ($res['data']['id'] ?? false) {
            DolphinAuth::$id = $res['data']['user_id'];
            DolphinAuth::$uuid = $res['data']['id'];
            DolphinAuth::$issuedAt = $res['data']['issued_at'];
            DolphinAuth::$expiredAt = $res['data']['expired_at'];

            return $next($request);
        }

        return $this->unauthorize();
    }

    private function unauthorize()
    {
        return response()->json([
            'message' => 'Unauthorized'
        ], 401);
    }
}