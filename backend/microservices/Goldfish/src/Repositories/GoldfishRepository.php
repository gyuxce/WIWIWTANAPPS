<?php

namespace GoldfishMicroservice\Repositories;

use Illuminate\Support\Facades\Http;

class GoldfishRepository
{
    public $header = [
        // 'Content-Type' => 'application/json',
        'Accept' => 'application/json',
    ];

    public function health()
    {
        $url = config('goldfish.url') . '/health';
        $ress = Http::withHeaders($this->header)->send('GET', $url);
        return $this->decode($ress);
    }

    public function upload($body = [])
    {
        $body = ['json' => $body];

        $url = config('goldfish.url') . '/api/v1/auth/sign-in';
        $ress = Http::withHeaders($this->header)->send('POST', $url, $body);
        return $this->decode($ress);
    }

    private function decode($ress)
    {
        return json_decode($ress, true);
    }
}