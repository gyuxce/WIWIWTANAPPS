<?php

namespace App\Models\Base;

use App\Models\Base\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserFiles extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'user_files';

    protected $fillable = [
        "uuid",
        "type",
        "description",
        "status",
        "file_id",
        "user_id",
        "slug",
    ];

    const RELATIONS = [
        "user" => ["table" => "users", "field" => "user_id"],
        "file" => ["table" => "files", "field" => "file_id"],
    ];

    protected $hidden = [];

    protected $casts = [];

    public function file()
    {
        return $this->belongsTo(File::class, 'file_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
