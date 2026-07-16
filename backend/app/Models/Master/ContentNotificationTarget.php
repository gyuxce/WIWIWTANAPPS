<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use App\Models\Base\User;

class ContentNotificationTarget extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;

    protected $table = 'content_notification_target';

    protected $fillable = [
        "uuid",
        "cn_id",
        "user_id",
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

    public function notification()
    {
        return $this->belongsTo(ContentNotification::class, "cn_id");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

}