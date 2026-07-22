<?php

namespace App\Models\Training;

use App\Models\Base\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class CourseItem extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'course_items';

    protected $fillable = [
        "uuid",
        "group",
        "course_id",
        "parent_id",
        "is_header",
        "title",
        "title_japan",
        "description",
        "article_id",
        "exam_template_id",
        "event_id",
        "index",
        "type",
        "program_type",
        "level_module",
        "access_module",
        "is_active",
        "file_id",
        "weight_minimum",
    ];

    protected $hidden = [];

    protected $casts = [
        "is_header" => "boolean",
    ];

    const RELATIONS = [
        "exam_template" => ["table" => "exam_templates", "field" => "exam_template_id"],
        "module" => ["table" => "course_items", "field" => "parent_id"],
        "event" => ["table" => "events", "field" => "event_id"],
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, "course_id");
    }

    public function article()
    {
        return $this->belongsTo(Article::class, "article_id");
    }

    public function exam_template()
    {
        return $this->belongsTo(ExamTemplate::class, "exam_template_id");
    }

    public function module()
    {
        return $this->belongsTo(CourseItem::class, "parent_id");
    }

    public function event()
    {
        return $this->belongsTo(Event::class, "event_id");
    }

    public function materialContent()
    {
        return $this->hasMany(Article::class, "course_item_id");
    }

    public function content()
    {
        return $this->hasMany(CourseItem::class, "parent_id");
    }

    public function assesment()
    {
        return $this->hasMany(CourseItem::class, "parent_id");
    }

    public function classVirtual()
    {
        return $this->hasMany(CourseItem::class, "parent_id");
    }

    public function file()
    {
        return $this->belongsTo(File::class, "file_id");
    }

    public function assesmentStudent()
    {
        return $this->hasOne(UserCourseItem::class, "item_id")->where('user_id', Auth::id())->orderBy('working_date', 'desc');
    }

    public function assesmentStudentHistory()
    {
        return $this->hasMany(UserCourseItem::class, "item_id")->where('user_id', Auth::id())->orderBy('working_date', 'desc');
    }
}
