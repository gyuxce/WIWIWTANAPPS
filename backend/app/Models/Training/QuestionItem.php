<?php

namespace App\Models\Training;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class QuestionItem extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'question_items';

    protected $fillable = [
        "uuid",
        "question_id",
        "description",
        "is_correct",
        "body_type",
        "body_url",
        "body_file_id",
        "index",
        "weight",
    ];

    protected $hidden = [];

    protected $casts = [
        "is_correct" => "boolean",
    ];
    public function question()
    {
        return $this->belongsTo(Question::class, "question_id");
    }
}
