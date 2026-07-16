<?php

namespace App\Models\Base;

use App\Services\BaseCrud\Traits\HasBaseOwner;
use App\Services\BaseCrud\Traits\HasBaseTable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;


class Menu extends Authenticatable
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'menus';

    protected $fillable = [
        "uuid",
        "name",
        "description",
        "slug"
    ];

    protected $casts = [
    ];
}
