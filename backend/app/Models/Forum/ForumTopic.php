<?php

namespace App\Models\Forum;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class ForumTopic extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'forum_topics';

    protected $fillable = [
        "uuid",
        "name",
        "description",
        "file_id",
        "type",
        "index",
        "count_post",
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

}
