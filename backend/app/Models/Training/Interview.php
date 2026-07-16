<?php

namespace App\Models\Training;

use App\Models\Base\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class Interview extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'interviews';

    protected $fillable = [
        "uuid",
        "user_id",
        "type",
        "interview_date",
        "name",
        "position",
        "agency",
        "link",
    ];

    protected $hidden = [];

    protected $casts = [];
    const RELATIONS = [
        "user" => ["table" => "user", "field" => "user_id"],
    ];
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
