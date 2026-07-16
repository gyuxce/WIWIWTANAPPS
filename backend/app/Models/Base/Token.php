<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class Token extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner, SoftDeletes;

    protected $table = 'tokens';

    protected $fillable = [
        "uuid",
        "is_active",
        "user_id",
        "platform_id",
        "refresh_token",
        "is_blocked",
        "expires_at",
    ];

    protected $hidden = [];

    protected $casts = [
        "is_active" => "boolean",
        "is_blocked" => "boolean",
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}