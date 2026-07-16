<?php

namespace App\Policies\Base;

use App\Models\Base\User;
use Illuminate\Auth\Access\Response;
use App\Services\Dolphin\DolphinAuth;

class FilePolicy
{

    public function before(User $user, string $ability): bool|null
    {
        //if ($user->isSuperadmin()) {
//return true;
//}
        return null;
    }

    public function viewAny(?User $user)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function view(?User $user, User $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function create(?User $user)
    {
        $auth = DolphinAuth::user()->role_id;
        if($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
    }

    public function update(?User $user, User $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, User $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function bulkDelete(?User $user, $args)
    {
        // $args['ids']
        $auth = DolphinAuth::user()->role_id;
        if($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function forceDelete(?User $user, User $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

}
