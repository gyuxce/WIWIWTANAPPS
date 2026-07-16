<?php

namespace App\Models\Base;

use App\Services\BaseCrud\Traits\HasBaseOwner;
use App\Services\BaseCrud\Traits\HasBaseTable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;


class RoleMenu extends Authenticatable
{

    use HasFactory, HasBaseTable, HasBaseOwner;

    protected $table = 'role_menus';

    protected $fillable = [
        "uuid",
        "role_id",
        "menu_id",
    ];

    protected $casts = [
    ];

    public function menu (){
        return $this->belongsTo(Menu::class, "menu_id");
    }

    public function role (){
        return $this->belongsTo(Role::class, "role_id");
    }
}
