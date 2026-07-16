<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\File;

class Seminar extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'seminars';

    protected $fillable = [
        "uuid",
        "name",
        "link",
        "started_at",
        "finished_at",
        "description",
        "cover_id",
        "status",
    ];

    protected $casts = [
    ];

    public function cover()
    {
        return $this->belongsTo(File::class, 'cover_id');
    }
}
