<?php

namespace DolphinMicroservice\Http\Controllers\Api\V1;


use DolphinMicroservice\Http\Controllers\Controller;
use DolphinMicroservice\Http\Requests\RefreshTokenRequest;
use DolphinMicroservice\Repositories\DolphinRepository;

class RefreshController extends Controller
{
    public $validation = RefreshTokenRequest::class;
    public $authService;

    public function __construct()
    {
        $this->authService = new DolphinRepository();
    }

    public function store()
    {
        $req = app($this->validation);
        $data = $req->validated();
        return $this->authService->refreshToken($data['refresh_token']);
    }
}