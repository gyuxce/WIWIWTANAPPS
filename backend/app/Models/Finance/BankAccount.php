<?php

namespace App\Models\Finance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class BankAccount extends Model {

use HasFactory, HasBaseTable, HasBaseOwner;use SoftDeletes;

protected $table = 'bank_accounts';

protected $fillable =[
"uuid",
"name",
"bank_id",
"account_name",
"account_number",
"is_active",
];

protected $hidden =[
];

protected $casts =[
"is_active"=> "boolean",
];

public function bank() {
return $this->belongsTo(Bank::class,"bank_id")->withTrashed();
}

}