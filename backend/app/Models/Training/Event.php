<?php

namespace App\Models\Training;

use App\Models\Base\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'events';

    protected $fillable = [
        "uuid",
        "title",
        "description",
        "from",
        "to",
        "started_at",
        "finished_at",
        "recording_file_id",
        "external_url",
        "external_passkey",
        "status",
        "cover_file_id",
        "participant_max",
        "is_online",
        "address_id",
        "is_active",
    ];


    protected $dates = [
        "from",
        "to",
        "started_at",
        "finished_at",
    ];

    protected $hidden = [];

    protected $casts = [
        "is_online" => "boolean",
        "is_active" => "boolean",
    ];

    public function file()
    {
        return $this->belongsTo(File::class, "recording_file_id");
    }

    public function cover()
    {
        return $this->belongsTo(File::class, "cover_file_id");
    }

    public function courseItem()
    {
        return $this->hasOne(CourseItem::class);
    }
}
