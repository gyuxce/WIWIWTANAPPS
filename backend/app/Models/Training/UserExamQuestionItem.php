<?php

namespace App\Models\Training;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class UserExamQuestionItem extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'user_exam_question_items';

    protected $fillable = [
        "uuid",
        "user_exam_id",
        "question_id",
        "is_selected",
        "index",
        "o_description",
        "o_body_type",
        "o_body_url",
        "o_body_file_id",
        "o_is_correct",
        "question_item_id",
        "o_weight",
    ];

    protected $hidden = [];

    protected $casts = [
        "is_selected" => "boolean",
        "o_is_correct" => "boolean",
    ];

    public function userExam()
    {
        return $this->belongsTo(UserExam::class, "user_exam_id");
    }

    public function question()
    {
        return $this->belongsTo(Question::class, "question_id");
    }
    public function question_item()
    {
        return $this->belongsTo(QuestionItem::class, "question_item_id");
    }
}
