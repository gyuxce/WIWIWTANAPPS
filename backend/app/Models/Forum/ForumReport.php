<?php

namespace App\Models\Forum;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Base\User;

class ForumReport extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'forum_reports';

    protected $fillable = [
        "uuid",
        "notes",
        "status",
        "type",
        "user_id",
        "post_id",
        "comment_id",
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function post()
    {
        return $this->belongsTo(ForumPost::class, "post_id")->withTrashed();
    }

    public function comment()
    {
        return $this->belongsTo(ForumComment::class, "comment_id")->withTrashed();
    }

}
