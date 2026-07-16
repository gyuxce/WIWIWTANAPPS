<?php

namespace DolphinMicroservice\Repositories;

use Illuminate\Support\Facades\Http;

class DolphinRepository
{
    public $header = [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
    ];

    public function health()
    {
        $url = config('62dolphin.url') . '/api/health';
        $ress = Http::withHeaders($this->header)->send('GET', $url);
        return $this->decode($ress);
    }

    public function verify($token = "")
    {
        $body = ['json' => ['access_token' => $token]];

        $url = config('62dolphin.url') . '/api/v1/tokens/verify';
        $ress = Http::withHeaders($this->header)->send('POST', $url, $body);
        return $this->decode($ress);
    }

    public function logIn($body = [])
    {
        $body['platform_id'] = (int) $body['platform_id'] ?? 0;
        $body = ['json' => $body];

        $url = config('62dolphin.url') . '/api/v1/auth/sign-in';
        $ress = Http::withHeaders($this->header)->send('POST', $url, $body);
        return $this->decode($ress);
    }

    public function checkPassword($password = "", $hashed_password = "")
    {
        $body = [
            'json' => [
                'password' => $password,
                'hashed_password' => $hashed_password
            ]
        ];
        $url = config('62dolphin.url') . '/api/v1/passwords/check';
        $ress = Http::withHeaders($this->header)->send('POST', $url, $body);
        $data = $this->decode($ress);
        if (empty($data['status']) || $data['status'] != "success") {
            abort(422, 'Invalid old password');
        }
    }

    public function hashPassword($password = "")
    {
        $body = [
            'json' => [
                'password' => $password
            ]
        ];
        $url = config('62dolphin.url') . '/api/v1/passwords/create';
        $ress = Http::withHeaders($this->header)->send('POST', $url, $body);
        $data = $this->decode($ress);

        if (empty($data['data']['hashed_password'])) {
            abort(422, 'Dolphin: Unable hashed password');
        }
        return $data['data']['hashed_password'];
    }

    public function refreshToken($refresh_token = "")
    {
        $body = [
            'json' => [
                "refresh_token" => $refresh_token
            ]
        ];

        $url = config('62dolphin.url') . '/api/v1/tokens/refresh';
        $ress = Http::withHeaders($this->header)->send('POST', $url, $body);
        return $this->decode($ress);
    }

    public function logOut($refresh_token = [])
    {
        $body = [
            'json' => [
                "refresh_token" => $refresh_token
            ]
        ];

        $url = config('62dolphin.url') . '/api/v1/auth/sign-out';
        $ress = Http::withHeaders($this->header)->send('POST', $url, $body);
        return $this->decode($ress);
    }

    private function decode($ress)
    {
        return json_decode($ress, true);
    }
}
