<?php

namespace SailfishMicroservice\Repositories;

use Illuminate\Support\Facades\Http;

class SailfishRepository
{
    public $header = [
        // 'Content-Type' => 'application/json',
        'Accept' => 'application/json',
    ];

    public function health()
    {
        $url = config('sailfish.url') . '/health';
        $ress = Http::withHeaders($this->header)->send('GET', $url);
        return $this->decode($ress);
    }

    public function sendEmail($params = [])
    {

        $body = [
            'json' => [
                "type" => "email",
                'recipient' => $params['recipient'],
                'recipient_name' => $params['recipient_name'],
                'title' => $params['title'],
                'body' => $params['body'],
                'template' => $params['template'],
                'template_params' => $params['template_params'],
            ]
        ];

        $url = config('sailfish.url') . '/api/v1/notifications/push';
        $ress = Http::withHeaders($this->header)->send('POST', $url, $body);
        return $this->decode($ress);
    }

    private function decode($ress)
    {
        return json_decode($ress, true);
    }
}