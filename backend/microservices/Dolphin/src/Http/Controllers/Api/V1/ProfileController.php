<?php

namespace DolphinMicroservice\Http\Controllers\Api\V1;

use App\Services\BaseCrud\BaseCrud;
use DolphinMicroservice\Repositories\DolphinAuth;
use Illuminate\Http\Request;

class ProfileController extends BaseCrud
{

    public function __construct()
    {
        $this->model = config('62dolphin.user_model');
        $this->resource = config('62dolphin.user_resource');
    }

    public function index(Request $req)
    {
        return $this->show($req, DolphinAuth::id());
    }
}
