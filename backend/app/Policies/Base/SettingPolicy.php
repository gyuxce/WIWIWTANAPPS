<?php

namespace App\Policies\Base;

use App\Models\Base\Setting;
use App\Models\Base\User;
use App\Policies\HasRolesPolicies;
use Illuminate\Auth\Access\Response;
use App\Services\Dolphin\DolphinAuth;

class SettingPolicy
{
    use HasRolesPolicies;
    protected $menu = "pengaturan";

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

    public function view(?User $user, Setting $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function create(?User $user)
    {
        return Response::allow();
    }

    public function update(?User $user, Setting $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function delete(?User $user, Setting $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function bulkDelete(?User $user, $args)
    {
        // $args['ids']
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function forceDelete(?User $user, Setting $row)
    {
        return  Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

}
