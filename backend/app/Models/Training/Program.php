<?php

namespace App\Models\Training;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class Program extends Model {

use HasFactory, HasBaseTable, HasBaseOwner;use SoftDeletes;

protected $table = 'programs';

protected $fillable =[
"uuid",
"code",
"title",
"description",
"is_active",
];

protected $hidden =[
];

protected $casts =[
"is_active"=> "boolean",
];

}