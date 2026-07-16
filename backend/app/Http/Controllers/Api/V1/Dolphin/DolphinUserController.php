<?php

namespace App\Http\Controllers\Api\V1\Dolphin;

use App\Http\Resources\V1\Base\UserResource;
use App\Models\Base\User;
use App\Services\BaseCrud\BaseCrud;
use App\Services\Dolphin\DolphinAuth;

class DolphinUserController extends BaseCrud
{
    public $model = User::class;
    public $resource = UserResource::class;
    public $abilityPolicyShow = null;

    public function profile()
    {
        $id = DolphinAuth::id();

        return $this->show(request(), $id);
    }
}