<?php

namespace App\Models\Training;

use App\Models\Base\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\User;


class UserExam extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'user_exams';

    protected $fillable = [
        "uuid",
        "number",
        "template_id",
        "user_id",
        "duration",
        "requested_at",
        "scheduled_at",
        "expired_at",
        "started_at",
        "finished_at",
        "weight_total",
        "weight_achieved",
        "user_exam_schedule_id",
        "status",
        "jadwal_tersedia",
        "file_tes_character_status",
        "link",
        "working_date",
    ];

    protected $hidden = [];

    protected $casts = [];

    const RELATIONS = [
        "user" => ["table" => "users", "field" => "user_id"],
        "exam_schedule_active" => ["table" => "exam_schedules", "field" => "user_exam_schedule_id"],
    ];

    public function template()
    {
        return $this->belongsTo(ExamTemplate::class, "template_id")->withTrashed();
    }


    public function user()
    {
        return $this->belongsTo(User::class, "user_id")->withTrashed();
    }
    public function exam_schedules()
    {
        return $this->hasMany(ExamSchedule::class, "user_exam_id");
    }

    public function exam_schedule_active()
    {
        return $this->belongsTo(ExamSchedule::class, 'user_exam_schedule_id');
    }

    public function fileTesCharacter()
    {
        return $this->hasOneThrough(File::class, UserExamQuestion::class, 'user_exam_id', 'id', 'id', 'a_body_file_id');
    }

    public function progress()
    {
        return $this->belongsTo(ExamTemplate::class, "template_id")->where('type', 1);
    }
    public function userQuestion()
    {
        return $this->hasMany(UserExamQuestion::class, "user_exam_id");
    }
}
