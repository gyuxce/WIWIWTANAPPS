<?php

namespace App\Models\Forum;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class ForumLike extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;

    protected $table = 'forum_likes';

    protected $fillable = [
        "uuid",
        "description",
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
        return $this->belongsTo(ForumPost::class, "post_id");
    }

    public function comment()
    {
        return $this->belongsTo(ForumComment::class, "comment_id");
    }
}
