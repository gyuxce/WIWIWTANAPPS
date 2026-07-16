<?php

namespace App\Models\Forum;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\User;

class ForumComment extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'forum_comments';

    protected $fillable = [
        "uuid",
        "comment",
        "index",
        "parent_id",
        "user_id",
        "post_id",
        "replied_to",
        "is_publish",
        "is_update",
        "count_like",
        "count_report",
        "status_report",
    ];

    protected $hidden = [
    ];

    protected $casts = [
        "is_publish" => "boolean",
        "is_update" => "boolean",
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id")->withTrashed();
    }

    public function post()
    {
        return $this->belongsTo(ForumPost::class, "post_id")->withTrashed();
    }

    public function child()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function replied()
    {
        return $this->belongsTo(User::class, "replied_to")->withTrashed();
    }

    public static function userLikeComment($commentId)
    {
        $check = ForumLike::where('comment_id', $commentId)->where('user_id', auth()->user()->id ?? 0)->first();
        if ($check) {
            return true;
        } else {
            return false;
        }
    }

    public static function likeComment($commentId)
    {
        $check = ForumLike::where('comment_id', $commentId)->where('user_id', auth()->user()->id ?? 0)->first();
        return $check;
    }

    public function reports()
    {
        return $this->hasMany(ForumReport::class, "comment_id");
    }

    public static function isUserOwn($commentId)
    {
        $check = ForumComment::where('id', $commentId)->where('user_id', auth()->user()->id ?? 0)->first();
        if ($check) {
            return true;
        } else {
            return false;
        }
    }

}
