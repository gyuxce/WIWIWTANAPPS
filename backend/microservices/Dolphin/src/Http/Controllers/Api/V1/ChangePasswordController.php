<?php

namespace DolphinMicroservice\Http\Controllers\Api\V1;

use App\Models\Base\User;
use DolphinMicroservice\Http\Controllers\Controller;
use DolphinMicroservice\Http\Requests\ChangePasswordRequest;
use DolphinMicroservice\Repositories\DolphinAuth;
use DolphinMicroservice\Repositories\DolphinRepository;
use SailfishMicroservice\Repositories\SailfishRepository;

class ChangePasswordController extends Controller
{
    public $validation = ChangePasswordRequest::class;
    public $authService;
    public $notifService;

    public function __construct()
    {
        $this->authService = new DolphinRepository();
        $this->notifService = new SailfishRepository();
    }

    public function store()
    {
        $req = app($this->validation);
        $data = $req->validated();

        $user = DolphinAuth::user();

        $this->authService->checkPassword($data['password_old'], $user->password);

        $new_password = $this->authService->hashPassword($data['password']);

        $user->update(['password' => $new_password]);

        $this->notifService->sendEmail([
            "recipient" => $user->email,
            "recipient_name" => $user->name,
            "title" => "Selamat Datang",
            "body" => "test",
            "template" => "notif_password_updated.html",
            "template_params" => [
                "name" => 'test'
            ]
        ]);

        return ['success' => true];
    }
}