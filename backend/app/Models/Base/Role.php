<?php
namespace App\Models\Base;

use App\Services\BaseCrud\Traits\HasBaseOwner;
use App\Services\BaseCrud\Traits\HasBaseTable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;


class Role extends Authenticatable
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'roles';

    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 1;
    const LABEL_STATUS = [
        self::STATUS_INACTIVE => 'Tidak Aktif',
        self::STATUS_ACTIVE => 'Aktif',
    ];

    protected $fillable = [
        "uuid",
        "name",
        "status",
    ];

    protected $casts = [
    ];

    public function users() {
        return $this->hasMany(User::class, "role_id");
    }

    public function roleMenus() {
        return $this->hasMany(RoleMenu::class, "role_id");
    }
}
