<?php

namespace App\Policies\Base;

use App\Models\Base\HarshWord;
use App\Models\Base\User;
use App\Policies\HasRolesPolicies;
use Illuminate\Auth\Access\Response;


class HarshWordPolicy
{

    use HasRolesPolicies;
    protected $menu = "forum_diskusi";

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

    public function view(?User $user, HarshWord $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function create(?User $user)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function update(?User $user, HarshWord $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function delete(?User $user, HarshWord $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function bulkDelete(?User $user, $args)
    {
        // $args['ids'] 
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

    public function forceDelete(?User $user, HarshWord $row)
    {
        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
    }

}