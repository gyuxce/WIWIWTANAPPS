<?php

namespace App\Models\Training;

use App\Models\Base\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class UserExamQuestion extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'user_exam_questions';

    protected $fillable = [
        "uuid",
        "user_exam_id",
        "question_id",
        "index",
        "o_title",
        "o_description",
        "o_body_type",
        "o_body_url",
        "o_body_file_id",
        "a_body_type",
        "a_body_text",
        "a_body_url",
        "a_body_file_id",
        "a_weight",
        "o_weight_true",
        "o_weight_null",
        "o_weight_false",
        "o_weight_min",
        "o_weight_max",
        "assessed_at",
        "assessed_by",
    ];

    protected $hidden = [];

    protected $casts = [];

    public function exam()
    {
        return $this->belongsTo(UserExam::class, "user_exam_id");
    }

    public function question()
    {
        return $this->belongsTo(Question::class, "question_id")->withTrashed();
    }

    public function origin_file()
    {
        return $this->belongsTo(File::class, "o_body_file_id")->withTrashed();
    }

    public function file()
    {
        return $this->belongsTo(File::class, "a_body_file_id");
    }

    public function user_exam_question_item()
    {
        return $this->hasOne(UserExamQuestionItem::class, 'question_id', 'question_id')->where('is_selected', true);
    }
}
