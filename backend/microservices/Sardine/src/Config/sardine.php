<?php

use App\Http\Resources\V1\Base\UserResource;
use App\Models\Base\User;

return [
    'url' => env('SARDINE_BASEURL', 'http://localhost:7003'),
    'user_model' => User::class,
    'user_resource' => UserResource::class,
];