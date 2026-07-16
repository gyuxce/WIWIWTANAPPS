<?php

namespace App\Services\Dolphin\Traits;


trait HasUser
{
    public function get()
    {
        return $this->fetch('GET', '/users');
    }

    public function create($body)
    {
        return $this->fetch('POST', '/users', $body);
    }
}