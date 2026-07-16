<?php

namespace App\Models\Training;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\User;


class UserSessions extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'user_sessions';

    protected $fillable = [
        "uuid",
        "user_id",
        "exam_template_item_id",
        "started_at",
    ];

    protected $hidden = [];

    protected $casts = [];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id")->withTrashed();
    }
}
