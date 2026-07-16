<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certification extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner, SoftDeletes;

    protected $table = 'certifications';

    protected $fillable = [
        "uuid",
        "name",
        "detail",
        "description",
        "link",
        "status"
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

}