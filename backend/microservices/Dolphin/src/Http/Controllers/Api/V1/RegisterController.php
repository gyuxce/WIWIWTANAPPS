<?php

namespace DolphinMicroservice\Http\Controllers\Api\V1;


use DolphinMicroservice\Http\Controllers\Controller;
use DolphinMicroservice\Http\Requests\SignupRequest;
use DolphinMicroservice\Repositories\DolphinRepository;

class RegisterController extends Controller
{
    public $validation = SignupRequest::class;
    
    public $authService;

    public function __construct()
    {
        $this->authService = new DolphinRepository();
    }

    public function store()
    {
        $req = app($this->validation);
        return ['success' => true];
    }
}