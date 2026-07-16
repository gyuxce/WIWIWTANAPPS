<?php

namespace DolphinMicroservice\Http\Controllers\Api\V1;


use DolphinMicroservice\Http\Controllers\Controller;
use DolphinMicroservice\Http\Requests\LogoutRequest;
use DolphinMicroservice\Repositories\DolphinRepository;

class LogoutController extends Controller
{

    public $validation = LogoutRequest::class;
    public $authService;

    public function __construct()
    {
        $this->authService = new DolphinRepository();
    }


    public function store()
    {
        $req = app($this->validation);
        $data = $req->validated();
        return $this->authService->logOut($data['refresh_token']);
    }
}