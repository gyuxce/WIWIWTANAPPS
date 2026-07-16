<?php

namespace App\Models\Training;

use App\Models\Base\File;
use App\Models\Base\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class ExamTemplateItem extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'exam_template_items';

    protected $fillable = [
        "uuid",
        "template_id",
        "question_id",
        "index",
        "is_header",
        "parent_id",
        "title",
        "description",
        "body_type",
        "body_url",
        "body_file_id",
        "is_introduction",
        "language_type",
        "duration",
        "count_question",
        "course_item_id",
        "weight_minimum",
    ];

    protected $hidden = [];

    protected $casts = [
        "is_header" => "boolean",
    ];

    public function template()
    {
        return $this->belongsTo(ExamTemplate::class, "template_id");
    }

    public function question()
    {
        return $this->belongsToMany(Question::class, 'exam_template_items', 'parent_id', 'question_id');
    }

    public function child()
    {
        return $this->hasMany(ExamTemplateItem::class, "parent_id")->withTrashed();
    }

    public function courseItem()
    {
        return $this->belongsTo(CourseItem::class, "course_item_id");
    }

    public function file()
    {
        return $this->belongsTo(File::class, "body_file_id");
    }

    public function userSessionLanguage()
    {
        return $this->hasOne(User::class, "current_sesi_language_id")->where('id', Auth::id());
    }

    public function userStartedSession()
    {
        return $this->hasOne(UserSessions::class, "exam_template_item_id")->where('user_id', Auth::id());
    }
}
