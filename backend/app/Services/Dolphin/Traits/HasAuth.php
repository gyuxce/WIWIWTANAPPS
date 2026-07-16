<?php

namespace App\Services\Dolphin\Traits;


trait HasAuth
{
    public function signIn($body)
    {
        return $this->fetch('POST', '/auth/sign-in', $body);
    }

    public function signUp($body)
    {
        return $this->fetch('POST', '/auth/sign-up', $body);
    }

    public function refreshToken($body)
    {
        return $this->fetch('POST', '/tokens/refresh', $body);
    }

    public function adapterVerify($body, $adapter)
    {
        return $this->fetch('POST', '/auth/'.$adapter.'/verify', $body);
    }
}