<?php

namespace DolphinMicroservice\Http\Controllers\Api\V1;


use DolphinMicroservice\Http\Controllers\Controller;
use DolphinMicroservice\Http\Requests\LoginRequest;
use DolphinMicroservice\Repositories\DolphinRepository;

class LoginController extends Controller
{
    public $validation = LoginRequest::class;
    public $authService;

    public function __construct()
    {
        $this->authService = new DolphinRepository();
    }

    public function store()
    {
        $req = app($this->validation);
        return $this->authService->logIn($req->validated());
    }
}