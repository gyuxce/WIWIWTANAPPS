<?php

namespace App\Models\Training;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\User;


class UserArticle extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'user_article';

    protected $fillable = [
        "uuid",
        "user_id",
        "article_id",
        "duration",
        "status",
    ];

    protected $hidden = [];

    protected $casts = [];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    public function article()
    {
        return $this->belongsTo(Article::class, "article_id");
    }
}
