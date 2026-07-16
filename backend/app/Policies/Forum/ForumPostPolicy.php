<?php

namespace App\Policies\Forum;

use App\Models\Forum\ForumPost;
use App\Models\Base\User;
use App\Policies\HasRolesPolicies;
use App\Services\Dolphin\DolphinAuth;
use Illuminate\Auth\Access\Response;

class ForumPostPolicy
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

    public function view(?User $user, ForumPost $row)
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
        // return  Response::deny('You can not access this data.');
    }

    public function update(?User $user, ForumPost $row)
    {
        if (DolphinAuth::user()->id != $row->user_id) {
            return Response::deny('You can not access this data.');
        }

        if(!$this->allow) {
            return  Response::deny('You can not access this data.');
        }
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, ForumPost $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }

        if (DolphinAuth::user()->id != $row->user_id) {
            return Response::deny('You can not access this data.');
        }

        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function bulkDelete(?User $user, ForumPost $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }

        if (DolphinAuth::user()->id != $row->user_id) {
            return Response::deny('You can not access this data.');
        }
        
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function forceDelete(?User $user, ForumPost $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }

        if (DolphinAuth::user()->id != $row->user_id) {
            return Response::deny('You can not access this data.');
        }
        
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

}