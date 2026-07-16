<?php

namespace App\Policies\Base;

use App\Models\Base\User;
use App\Policies\HasRolesPolicies;
use Illuminate\Auth\Access\Response;
use App\Services\Dolphin\DolphinAuth;

class ActivityLogPolicy
{
    use HasRolesPolicies;
    protected $menu = "dashboard";

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

        $auth = DolphinAuth::user()->role_id;

        if ($auth <= 2) {
            return Response::allow();
        }

        return Response::allow();

        // return  Response::deny('You can not access this data.');
    }

    public function view(?User $user, User $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        
        $auth = DolphinAuth::user()->role_id;

        if ($auth <= 2) {
            return Response::allow();
        }
        
        return Response::allow();
        
        // return  Response::deny('You can not access this data.');
    }

    public function create(?User $user)
    {
        return  Response::deny('You can not access this data.');
    }

    public function update(?User $user, User $row)
    {
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, User $row)
    {
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function bulkDelete(?User $user, $args)
    {
        // $args['ids']
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function forceDelete(?User $user, User $row)
    {
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

}
