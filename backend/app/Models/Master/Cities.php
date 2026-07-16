<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class Cities extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'cities';

    protected $fillable = [
        "uuid",
        "name",
        "province_id",
        "code",
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public static function getIdByName($name)
    {
        return self::where('name', "LIKE", "%{$name}%")->first()->id ?? null;
    }

}
