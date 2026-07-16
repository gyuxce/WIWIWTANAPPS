<?php

namespace App\Services\Dolphin;

use App\Services\Dolphin\Traits\HasAuth;
use App\Services\Dolphin\Traits\HasPassword;
use App\Services\Dolphin\Traits\HasUser;
use App\Services\Dolphin\Traits\HasToken;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Psr\Http\Message\ResponseInterface;

class Dolphin
{
    use HasAuth, HasPassword, HasUser, HasToken;

    public function fetch($method, $uri, $body = [], $auth = '')
    {
        try {
            $uri = config('62dolphin.url') . $uri;

            if (!empty($body)) {
                $body = ['json' => $body];
            }

            $headers = [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ];

            if ($auth != '') {
                $headers['Authorization'] = $auth;
            }

            $res = Http::withHeaders($headers)->send($method, $uri, $body);

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

    private function err(ResponseInterface|Response $res)
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
