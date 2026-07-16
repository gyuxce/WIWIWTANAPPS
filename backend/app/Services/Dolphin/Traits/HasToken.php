<?php

namespace App\Services\Dolphin\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

trait HasToken
{
    public function verify($token = '')
    {
        return $this->fetch('POST', '/tokens/verify', ['access_token' => $token]);
    }

    public function block(Request $req)
    {
        $accessToken = $req->bearerToken();
        $refreshToken = Auth::user()?->token?->refresh_token;

        return $this->fetch('POST', '/tokens/block-token', ['refresh_token' => $refreshToken], 'Bearer ' . $accessToken);
    }

    public function refresh($token)
    {
        return $this->fetch('POST', '/tokens/refresh', ['refresh_token' => $token]);
    }
}