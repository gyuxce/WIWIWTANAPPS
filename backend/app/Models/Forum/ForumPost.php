<?php

namespace App\Models\Forum;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Base\User;

class ForumPost extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'forum_posts';

    protected $fillable = [
        "uuid",
        "title",
        "description",
        "index",
        "user_id",
        "topic_id",
        "is_draft",
        "is_publish",
        "status",
        "count_like",
        "count_comment",
        "count_report",
        "status_report",
        "deleted_reason",
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function topic()
    {
        return $this->belongsTo(ForumTopic::class, "topic_id");
    }

    public function comments()
    {
        return $this->hasMany(ForumComment::class, "post_id");
    }

    public function parentComment()
    {
        return $this->hasMany(ForumComment::class, "post_id")
                ->where('parent_id', null);
    }

    public static function userLikePost($postId)
    {
        $check = ForumLike::where('post_id', $postId)->where('user_id', auth()->user()->id ?? 0)->first();
        if ($check) {
            return true;
        } else {
            return false;
        }
    }

    public static function likePost($postId)
    {
        $check = ForumLike::where('post_id', $postId)->where('user_id', auth()->user()->id ?? 0)->first();
        return $check;
    }

    public function likes()
    {
        return $this->hasMany(ForumLike::class, "post_id");
    }

    public function reports()
    {
        return $this->hasMany(ForumReport::class, "post_id");
    }

}
