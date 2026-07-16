<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class Otp extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner, SoftDeletes;

    protected $table = 'otps';

    protected $fillable = [
        "id",
        "type",
        "receiver",
        "code",
        "expires_at",
    ];

    protected $hidden = [];
}