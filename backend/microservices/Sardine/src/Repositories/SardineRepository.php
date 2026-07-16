<?php

namespace SardineMicroservice\Repositories;

use Illuminate\Support\Facades\Http;

class SardineRepository
{
    public $header = [
        // 'Content-Type' => 'application/json',
        'Accept' => 'application/json',
    ];

    public function health()
    {
        $url = config('sardine.url') . '/health';
        $ress = Http::withHeaders($this->header)->send('GET', $url);
        return $this->decode($ress);
    }

    public function upload($file, $params = [])
    {
        // example
        // visibility:public/private
        // folder:test-folder
        // file_name:dJntEgKqWbrI9fl2OFAoU5Fvf6qIzUqXFnq7DYAp.jpg
        // resize_width:100
        // resize_height:100
        // compress:200

        $body = [];

        if (!empty($params['visibility'])) {
            $body['visibility'] = $params['visibility'];
        }

        if (!empty($params['folder'])) {
            $body['folder'] = $params['folder'];
        }

        if (!empty($params['resize_width'])) {
            $body['resize_width'] = $params['resize_width'];
        }

        if (!empty($params['resize_height'])) {
            $body['resize_height'] = $params['resize_height'];
        }

        if (!empty($params['compress'])) {
            $body['compress'] = $params['compress'];
        }

        $url = config('sardine.url') . '/files';

        $ress = Http::withHeaders($this->header)
            ->attach('file', file_get_contents($file->path()), $file->getClientOriginalName())
            ->post($url, $body);


        return $this->decode($ress);
    }

    private function decode($ress)
    {
        return json_decode($ress, true);
    }
}