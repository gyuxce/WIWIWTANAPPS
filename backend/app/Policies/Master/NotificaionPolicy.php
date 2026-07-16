<?php

namespace App\Policies\Master;

use App\Models\Master\Notification;
use App\Models\Base\User;
use Illuminate\Auth\Access\Response;


class NotificaionPolicy
{

    public function before(User $user, string $ability): bool|null
    {
        return null;
    }

    public function viewAny(?User $user)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function view(?User $user, Notification $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function create(?User $user)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function update(?User $user, Notification $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, Notification $row)
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

    public function forceDelete(?User $user, Notification $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

}