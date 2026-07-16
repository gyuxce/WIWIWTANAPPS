<?php

namespace App\Models\Finance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;


class PaymentAdapter extends Model {

use HasFactory, HasBaseTable, HasBaseOwner;use SoftDeletes;

protected $table = 'payment_adapters';

protected $fillable =[
"uuid",
"code",
"title",
"description",
"currency_code",
"total_amount",
"is_active",
];

protected $hidden =[
];

protected $casts =[
"is_active"=> "boolean",
];

}