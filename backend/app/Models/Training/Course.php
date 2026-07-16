<?php

namespace App\Models\Training;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\File;

class Course extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'courses';

    protected $fillable = [
        "uuid",
        "title",
        "title_japan",
        "description",
        "count_articles",
        "count_events",
        "count_exam",
        "type",
        "cover_id",
    ];

    protected $hidden = [];

    protected $casts = [];

    public function cover()
    {
        return $this->belongsTo(File::class, 'cover_id');
    }
    public function courseItem()
    {
        return $this->hasMany(CourseItem::class, 'course_id');
    }

    public function articles()
    {
        return $this->hasMany(Article::class, 'course_id');
    }
}
