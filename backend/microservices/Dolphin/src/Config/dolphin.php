<?php

use App\Http\Resources\V1\Base\UserResource;
use App\Models\Base\User;

return [
    'url' => env('DOLPHIN_BASEURL', 'http://localhost:7001'),
    'user_model' => User::class,
    'user_resource' => UserResource::class,
];