<?php

namespace App\Models\Training;

use App\Models\Base\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;


class Article extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'articles';

    protected $fillable = [
        "uuid",
        "title",
        "description",
        "body_type",
        "body_url",
        "duration",
        "body_text",
        "body_file_id",
        "course_item_id",
        "cover_file_id",
        "course_id",
    ];

    protected $hidden = [];

    protected $casts = [];

    public function file()
    {
        return $this->belongsTo(File::class, 'body_file_id');
    }
    public function cover()
    {
        return $this->belongsTo(File::class, 'cover_file_id');
    }
    public function course()
    {
        return $this->belongsTo(File::class, 'course_id');
    }
    public function courseItem()
    {
        return $this->belongsTo(CourseItem::class, 'course_item_id');
    }

    public function user_article()
    {
        return $this->hasOne(UserArticle::class, 'article_id');
    }

    public function userArticle()
    {
        return
            $this->hasOne(UserArticle::class, 'article_id')->where('user_id', Auth::id());
    }
}
