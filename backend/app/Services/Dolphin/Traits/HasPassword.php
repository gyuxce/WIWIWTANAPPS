<?php

namespace App\Services\Dolphin\Traits;


trait HasPassword
{
    public function forgotPassword($body)
    {
        return $this->fetch('POST', '/passwords/forgot', $body);
    }

    public function resetPassword($body, $token)
    {
        return $this->fetch('PATCH', '/passwords/reset/' . $token, $body);
    }
}