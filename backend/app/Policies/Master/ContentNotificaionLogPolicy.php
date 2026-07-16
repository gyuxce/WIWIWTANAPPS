<?php

namespace App\Policies\Master;

use App\Models\Master\ContentNotificationLog;
use App\Models\Base\User;
use App\Policies\HasRolesPolicies;
use Illuminate\Auth\Access\Response;

class ContentNotificaionLogPolicy
{

    use HasRolesPolicies;
    protected $menu = "konten_notifikasi";

    protected $allow = false;

    public function __construct()
    {
        $permission = $this->__hasMenu();
        $this->allow = $permission;
    }

    public function before(User $user, string $ability): bool|null
    {
        return null;
    }

    public function viewAny(?User $user)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function view(?User $user, ContentNotificationLog $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function create(?User $user)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function update(?User $user, ContentNotificationLog $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, ContentNotificationLog $row)
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

    public function forceDelete(?User $user, ContentNotificationLog $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

}