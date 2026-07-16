<?php

namespace App\Policies;

use App\Models\Base\RoleMenu;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

trait HasRolesPolicies
{
    protected $auth;

    public function __hasMenu()
    {
        $this->auth = DolphinAuth::user();

        $role = $this->auth->role ?? null;

        if ($role != null) {
            $roleMenu = RoleMenu::whereHas('menu', function ($q) {
                            return $q->where('slug', $this->menu);
                        })->where('role_id', $role->id)->first();
            if ($roleMenu != null) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }

        return false;
    }
}