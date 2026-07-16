<?php

namespace App\Models\Training;

use App\Models\Base\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Support\Facades\Auth;

class Question extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'questions';

    protected $fillable = [
        "uuid",
        "type",
        "title",
        "description",
        "body_type",
        "body_url",
        "body_file_id",
        "weight_true",
        "weight_null",
        "weight_false",
        "weight_min",
        "weight_max",
        "index",
        "data"
    ];

    protected $hidden = [];

    protected $casts = [];

    public function file()
    {
        return $this->belongsTo(File::class, "body_file_id");
    }

    public function question_items()
    {
        return $this->hasMany(QuestionItem::class, "question_id");
    }

    public function userAnswareSelected()
    {
        return
            $this->hasOne(UserExamQuestionItem::class, 'question_id')->whereHas('userExam', function ($q) {
                $q->where('user_id', Auth::id());
            })->where('is_selected', true);
    }
    public function userRepoorteSelected()
    {
        return
            $this->hasOne(UserExamQuestionItem::class, 'question_id')->where('is_selected', true);
    }
}
