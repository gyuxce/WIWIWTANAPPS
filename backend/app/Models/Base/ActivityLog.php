<?php

namespace App\Models\Base;

use App\Services\BaseCrud\Traits\HasBaseOwner;
use App\Services\BaseCrud\Traits\HasBaseTable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;


class ActivityLog extends Authenticatable
{

    use HasFactory, HasBaseTable, HasBaseOwner;

    protected $table = 'activity_logs';

    protected $fillable = [
        "uuid",
        "user_id",
        "module_uuid",
        "action",
        "module",
        "data",
        "description"
    ];

    protected $casts = [
        "data" => "array"
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\Base\User::class, 'user_id');
    }
}
