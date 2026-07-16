<?php

namespace App\Policies\Training;
use App\Models\Training\ExamTemplateItem;
use App\Models\Base\User;
use App\Policies\HasRolesPolicies;
use Illuminate\Auth\Access\Response;

class ExamTemplateItemPolicy {

    use HasRolesPolicies;
    protected $menu = "materi_pelatihan";

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

    public function view(?User $user, ExamTemplateItem $row)
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

    public function update(?User $user, ExamTemplateItem $row)
    {
    return Response::allow();
    // return  Response::deny('You can not access this data.');
    }

    public function delete(?User $user, ExamTemplateItem $row)
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

    public function forceDelete(?User $user, ExamTemplateItem $row)
    {
    return Response::allow();
    // return  Response::deny('You can not access this data.');
    }

}