<?php

namespace App\Services\Sailfish;

use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

trait SailfishFetch
{
    public function fetch($method, $uri, $body = [], $auth = '', $query = [])
    {
        try {
            $uri = config('sailfish.url') . $uri;

            if (!empty($body)) {
                $body = ['json' => $body];
            }

            if (!empty($query)) {
                $body['query'] = $query;
            }

            $headers = [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ];

            if ($auth != '') {
                $headers['Authorization'] = $auth;
            }

            $res = Http::withHeaders($headers);

            $res = $res->send($method, $uri, $body);

            if (!$res->successful()) {
                $res->throw();
            }

            $data = json_decode((string) $res->getBody(), true);

            return response()->json($data);
        } catch (ClientException $ce) {

            return $this->err($ce->getResponse());
        } catch (RequestException $re) {

            return $this->err($re->response);
        } catch (\Exception $e) {

            return $this->resError($e->getMessage());
        }
    }

    private function err($res)
    {
        $statusCode = $res->getStatusCode() ?? 500;
        $errorData = json_decode((string) $res->getBody(), true);

        return $this->resError($errorData['message'] ?? 'Something went wrong', $errorData['data'] ?? null, $statusCode);
    }

    private function resError($msg, $data = null, $code = 500)
    {
        return response()->json([
            'status' => 'error',
            'message' => $msg,
            'data' => $data,
        ], $code);
    }
}