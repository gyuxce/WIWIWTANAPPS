<?php

namespace App\Policies\Base;

use App\Models\Base\Role;
use App\Models\Base\User;
use App\Policies\HasRolesPolicies;
use Illuminate\Auth\Access\Response;
use App\Services\Dolphin\DolphinAuth;

class RolePolicy
{
    use HasRolesPolicies;
    protected $menu = "manajemen_admin";

    protected $allow = false;

    public function __construct()
    {
        $permission = $this->__hasMenu();
        $this->allow = $permission;
    }


    public function before(User $user, string $ability): bool|null
    {
        //if ($user->isSuperadmin()) {
        //return true;
        //}
        return null;
    }

    public function viewAny(?User $user)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function view(?User $user, Role $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function create(?User $user)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
    }

    public function update(?User $user, Role $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, Role $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
    }

    public function bulkDelete(?User $user, $args)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
    }

    public function forceDelete(?User $user, Role $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return  Response::deny('You can not access this data.');
    }
}
