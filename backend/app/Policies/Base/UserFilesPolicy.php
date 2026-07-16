<?php

namespace App\Policies\Base;

use App\Models\Base\User;
use App\Models\Base\UserFiles;
use Illuminate\Auth\Access\Response;
use App\Services\Dolphin\DolphinAuth;

class UserFilesPolicy
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

    public function view(?User $user, UserFiles $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function create(?User $user)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function update(?User $user, UserFiles $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, UserFiles $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function bulkDelete(?User $user, $args)
    {
        // $args['ids']
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function forceDelete(?User $user, UserFiles $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }
}
