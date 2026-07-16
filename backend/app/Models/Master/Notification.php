<?php

namespace App\Models\Master;

use App\Models\Base\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner, SoftDeletes;

    protected $table = 'notifications';

    protected $fillable = [
        "uuid",
        "sender",
        "recipient",
        "category",
        "title",
        "body",
        "template",
        "priority",
        "status",
        "data",
        "user_id"
    ];

    protected $hidden = [
    ];

    protected $casts = [
        "data" => "array"
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}