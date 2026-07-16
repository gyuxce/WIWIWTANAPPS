<?php

namespace App\Policies\Base;

use App\Models\Base\User;
use App\Policies\HasRolesPolicies;
use Illuminate\Auth\Access\Response;
use App\Services\Dolphin\DolphinAuth;

class UserPolicy
{
    use HasRolesPolicies;
    protected $menu = "manajemen_admin";

    protected $menu_siswa = "siswa_wiwitan";

    protected $url_student = "api/v1/master/student";

    protected $allow = false;

    public function __construct()
    {
        $url = url()->current();
        $route = collect(\Route::getRoutes())->first(function ($route) use ($url) {
            return $route->matches(request()->create($url));
        });

        if ($route->getPrefix() == $this->url_student); {
            $this->menu = $this->menu_siswa;
        }

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
        if (!$this->allow) {
            return Response::deny('You can not access this data.');
        }
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function viewAnyStudent(?User $user)
    {
        if (!$this->allow) {
            return Response::deny('You can not access this data.');
        }
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function view(?User $user, User $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth == null) {
            return Response::allow();
        }
        if (!$this->allow) {
            return Response::deny('You can not access this data.');
        }
        return Response::allow();
        // return  Response::deny('You can not access this data.');
    }

    public function create(?User $user)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return Response::deny('You can not access this data.');
    }

    public function update(?User $user, User $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth == null) {
            return Response::allow();
        }
        if ($auth <= 2) {
            return Response::allow();
        }
        return Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, User $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function bulkDelete(?User $user, $args)
    {
        // $args['ids'] 
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }

    public function forceDelete(?User $user, User $row)
    {
        $auth = DolphinAuth::user()->role_id;
        if ($auth <= 2) {
            return Response::allow();
        }
        return Response::deny('You can not access this data.');
        // return  Response::deny('You can not access this data.');
    }
}
