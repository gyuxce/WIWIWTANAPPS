<?php

namespace App\Policies\Master;

use App\Models\Master\Seminar;
use App\Models\Base\User;
use App\Policies\HasRolesPolicies;
use App\Services\Dolphin\DolphinAuth;
use Illuminate\Auth\Access\Response;

class SeminarPolicy
{
    use HasRolesPolicies;
    protected $menu = "seminar_wiwitan";

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

    public function view(?User $user, Seminar $row)
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

        // return Response::allow();
        return  Response::deny('You can not access this data.');
    }

    public function update(?User $user, Seminar $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }

        if($this->allow) {
            return Response::allow();
        }

        // return Response::allow();
        return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, Seminar $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }

        if($this->allow) {
            return Response::allow();
        }

        // return Response::allow();
        return  Response::deny('You can not access this data.');
    }

    public function bulkDelete(?User $user, $args)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }

        if($this->allow) {
            return Response::allow();
        }

        // return Response::allow();
        return  Response::deny('You can not access this data.');
    }

    public function forceDelete(?User $user, Seminar $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }

        if($this->allow) {
            return Response::allow();
        }

        // return Response::allow();
        return  Response::deny('You can not access this data.');
    }

}