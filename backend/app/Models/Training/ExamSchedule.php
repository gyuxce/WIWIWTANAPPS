<?php

namespace App\Models\Training;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\User;


class ExamSchedule extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'exam_schedules';

    protected $dates = ['start_date', 'end_date'];

    protected $fillable = [
        "uuid",
        "user_exam_id",
        "start_date",
        "end_date",
    ];

    protected $hidden = [];

    protected $casts = [];

    public function userExam()
    {
        return $this->belongsTo(UserExam::class, "user_exam_id");
    }
}
