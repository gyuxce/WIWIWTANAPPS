<?php

namespace App\Models\Training;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\User;


class UserCourseItem extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'user_course_items';

    protected $fillable = [
        "uuid",
        "user_id",
        "course_id",
        "item_id",
        "progress",
        "user_exam_id",
        "event_id",
        "weight_minimum",
        "weight_maximum",
        "weight_total",
        "weight_final",
        "working_date",
        "is_skipped",
        "status",
        "link",
        "is_scheduled",
        "exam_template_item_id"
    ];

    protected $hidden = [];

    protected $casts = [
        "is_skipped" => "boolean",
    ];

    const RELATIONS = [
        "user" => ["table" => "users", "field" => "user_id"],
        "course" => ["table" => "courses", "field" => "course_id"],
        "item" => ["table" => "course_items", "field" => "item_id"],
    ];


    public function user()
    {
        return $this->belongsTo(User::class, "user_id")->withTrashed();
    }

    public function course()
    {
        return $this->belongsTo(Course::class, "course_id")->withTrashed();
    }

    public function item()
    {
        return $this->belongsTo(CourseItem::class, "item_id")->withTrashed();
    }

    public function userExam()
    {
        return $this->belongsTo(UserExam::class, "user_exam_id");
    }

    public function examTemplateItem()
    {
        return $this->belongsTo(ExamTemplateItem::class, "exam_template_item_id");
    }
}
