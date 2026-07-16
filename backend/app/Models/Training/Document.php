<?php

namespace App\Models\Training;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class Document extends Model {

use HasFactory, HasBaseTable, HasBaseOwner;use SoftDeletes;

protected $table = 'documents';

protected $fillable =[
"uuid",
"user_id",
"type",
"remarks",
"file_id",
"is_verified",
"verified_by",
"verified_at",
];

protected $hidden =[
];

protected $casts =[
"is_verified"=> "boolean",
];

}