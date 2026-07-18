<?php

namespace App\Http\Middleware;

use App\Models\Base\Token;
use App\Models\Base\User;
use App\Services\Dolphin\Dolphin as ServiceDolphin;
use App\Services\Dolphin\DolphinAuth;
use App\Services\Dolphin\LocalAuth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MobileAccess
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

        $dolphin = new ServiceDolphin();

        if (LocalAuth::enabled() && $localToken = (new LocalAuth())->verify($token)) {
            $user = User::where('id', $localToken->user_id)->first();
            if (!$user || $user->role_id != null) {
                return $this->unauthorize();
            }

            DolphinAuth::$id = $localToken->user_id;
            DolphinAuth::$uuid = $localToken->id;
            DolphinAuth::$issued_at = $localToken->issued_at;
            DolphinAuth::$expired_at = $localToken->expired_at;

            return $next($request);
        }

        $res = $dolphin->verify($token);
        if ($res?->getStatusCode() === 200) {
            $rt = Token::where('user_id', $res->getData()->data->user_id)->first();
            if ($rt == null) {
                return $this->unauthorize();
            }

            $user = User::where('id', $res?->getData()?->data?->user_id)->first();
            if ($user->role_id != null) {
                return $this->unauthorize();
            }

            DolphinAuth::$id = $res?->getData()?->data?->user_id;
            DolphinAuth::$uuid = $res?->getData()?->data?->id;
            DolphinAuth::$issued_at = $res?->getData()?->data?->issued_at;
            DolphinAuth::$expired_at = $res?->getData()?->data?->expired_at;

            return $next($request);
        }

        return $this->unauthorize();
    }

    private function unauthorize()
    {
        return response()->json([
            'message' => __('messages.unauthorized')
        ], 401);
    }
}
