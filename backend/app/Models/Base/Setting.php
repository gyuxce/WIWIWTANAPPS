<?php

namespace App\Models\Base;

use App\Services\BaseCrud\Traits\HasBaseOwner;
use App\Services\BaseCrud\Traits\HasBaseTable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;


class Setting extends Authenticatable
{

    use HasFactory, HasBaseTable, HasBaseOwner, SoftDeletes;

    protected $table = 'settings';

    protected $fillable = [
        "uuid",
        "name",
        "slug",
        "value",
        "group",
        "data",
        "description"
    ];

    protected $casts = [];
}
