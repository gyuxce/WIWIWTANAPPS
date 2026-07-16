<?php

namespace App\Models\Finance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Training\Program;


class TransactionItem extends Model {

use HasFactory, HasBaseTable, HasBaseOwner;use SoftDeletes;

protected $table = 'transaction_items';

protected $fillable =[
"uuid",
"transaction_id",
"program_id",
"title",
"description",
"amount",
"quantity",
"is_tax",
"total",
];

protected $hidden =[
];

protected $casts =[
"is_tax"=> "boolean",
];

public function transaction() {
return $this->belongsTo(Transaction::class,"transaction_id")->withTrashed();
}

public function program() {
return $this->belongsTo(Program::class,"program_id")->withTrashed();
}

}