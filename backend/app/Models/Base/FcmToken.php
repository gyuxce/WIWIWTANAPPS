<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use App\Services\BaseCrud\Traits\HasBaseTable;
// use App\Services\BaseCrud\Traits\HasBaseOwner;
// use Illuminate\Database\Eloquent\SoftDeletes;


class FcmToken extends Model
{

    use HasFactory;

    protected $table = 'fcm_tokens';

    protected $fillable = [
        "user_id",
        "os",
        "token",
    ];

    protected $hidden = [];

    protected $casts = [];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}