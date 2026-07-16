<?php

namespace App\Models\Training;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\User;


class UserCourse extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'user_courses';

    protected $fillable = [
        "uuid",
        "user_id",
        "course_id",
        "acquired_at",
        "started_at",
        "finished_at",
        "last_activity_at",
        "item_finished",
        "exam_score_total",
        "exam_score_achieved",
        "exam_score_normalized",
        "status",
    ];

    protected $hidden = [];

    protected $casts = [];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id")->withTrashed();
    }

    public function course()
    {
        return $this->belongsTo(Course::class, "course_id")->withTrashed();
    }
}
