<?php

namespace App\Models\Master;

use App\Models\Base\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;

class ContentNotificationLog extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;

    protected $table = 'content_notification_logs';

    protected $fillable = [
        "uuid",
        "cn_id",
        "description",
        "user_id",
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

    public function content_notification()
    {
        return $this->belongsTo(ContentNotification::class, 'cn_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}