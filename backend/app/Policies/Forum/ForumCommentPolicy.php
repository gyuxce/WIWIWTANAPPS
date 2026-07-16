<?php

namespace App\Policies\Forum;

use App\Models\Forum\ForumComment;
use App\Models\Base\User;
use Illuminate\Auth\Access\Response;
use App\Services\Dolphin\DolphinAuth;

class ForumCommentPolicy
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

    public function view(?User $user, ForumComment $row)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function create(?User $user)
    {
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function update(?User $user, ForumComment $row)
    {
        if (DolphinAuth::user()->id != $row->user_id) {
            return Response::deny('You can not access this data.');
        }
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, ForumComment $row)
    {
        if (DolphinAuth::user()->id != $row->user_id) {
            return Response::deny('You can not access this data.');
        }

        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function bulkDelete(?User $user, ForumComment $row)
    {
        if (DolphinAuth::user()->id != $row->user_id) {
            return Response::deny('You can not access this data.');
        }

        // $args['ids'] 
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function forceDelete(?User $user, ForumComment $row)
    {
        if (DolphinAuth::user()->id != $row->user_id) {
            return Response::deny('You can not access this data.');
        }
        
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

}