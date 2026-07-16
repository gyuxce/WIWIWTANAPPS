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


class ExamTemplate extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'exam_templates';

    protected $fillable = [
        "uuid",
        "title",
        "description",
        "duration",
        "is_randomized_question",
        "is_randomized_items",
        "retry_count",
        "weight_total",
        "weight_minimal",
        "is_active",
        "type",
        "link_url",
        "video_id",
    ];

    protected $hidden = [];

    protected $casts = [
        "is_randomized_question" => "boolean",
        "is_randomized_items" => "boolean",
        "is_active" => "boolean",
    ];

    public function introduction()
    {
        return $this->hasMany(ExamTemplateItem::class, "template_id")
            ->where('is_introduction', true)
            ->where('parent_id', null);
    }

    public function sesi()
    {
        return $this->hasMany(ExamTemplateItem::class, "template_id")
            ->where('is_header', true);
    }

    public function currentSessionLanguage()
    {
        return $this->hasOne(ExamTemplateItem::class, "template_id")->whereHas('userSessionLanguage', function ($q) {
            $q->where('id', Auth::id());
        });
    }

    public function video()
    {
        return $this->belongsTo(File::class, "video_id");
    }
}
