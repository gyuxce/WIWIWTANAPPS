<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class Province extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'province';

    protected $fillable = [
        "uuid",
        "name",
        "code",
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

    public static function getIdByName($name)
    {
        return self::where('name', "LIKE", "%{$name}%")->first()->id ?? null;
    }

}