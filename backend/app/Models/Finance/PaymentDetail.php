<?php

namespace App\Models\Finance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentDetail extends Model {

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'payment_details';

    protected $fillable =[
        "uuid",
        "payment_id",
        "adapter_id",
        "number",
        "checkout_url",
        "expired_at",
        "paid_at",
        "data_request",
        "data_callback",
    ];

    protected $hidden =[
    ];

    protected $casts = [
        'data_request' => 'json',
        'data_callback' => 'json',
    ];

    public function payment() {
        return $this->belongsTo(Payment::class,"payment_id")->withTrashed();
    }

}