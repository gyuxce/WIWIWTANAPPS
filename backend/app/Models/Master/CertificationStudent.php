<?php

namespace App\Models\Master;

use App\Models\Base\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

class CertificationStudent extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner, SoftDeletes;

    protected $table = 'certification_students';

    protected $fillable = [
        "uuid",
        "name",
        "user_id",
        "certification_id",
        "cert_date",
        "location",
        "cert_file_id",
        "status"
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];

    const RELATIONS = [
        "user" => ["table" => "users", "field" => "user_id"],
        "certification" => ["table" => "certifications", "field" => "certification_id"],
    ];

    public function certification()
    {
        return $this->belongsTo(Certification::class, 'certification_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function file()
    {
        return $this->belongsTo(\App\Models\Base\File::class, 'cert_file_id');
    }

}