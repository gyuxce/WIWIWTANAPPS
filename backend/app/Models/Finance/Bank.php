<?php

namespace App\Models\Finance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class Bank extends Model {

use HasFactory, HasBaseTable, HasBaseOwner;use SoftDeletes;

protected $table = 'banks';

protected $fillable =[
"uuid",
"name",
"code",
"remarks",
];

protected $hidden =[
];

protected $casts =[
];

}