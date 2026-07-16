<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContentNotification extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    // use SoftDeletes;

    protected $table = 'content_notifications';

    protected $fillable = [
        "uuid",
        "name",
        "description",
        "repeat_each",
        "send_at",
        "status",
        "is_active",
        "count_send",
        "send_at",
        "link",
        "target_status",
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

    public function targets()
    {
        return $this->hasMany(ContentNotificationTarget::class, 'cn_id');
    }

}