<?php

namespace App\Models\Finance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\User;

class Transaction extends Model {

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    const TYPE_ADMINSTRATION = "ADM";
    const TYPE_TRAINING = "TRA";

    protected $table = 'transactions';

    protected $fillable =[
        "uuid",
        "user_id",
        "number",
        "price_type",
        "issued_at",
        "expired_at",
        "currency_code",
        "total_amount",
        "total",
        "status",
        "total_left_amount",
        "xendit_customer_id",
        "xendit_plan_id",
    ];

    protected $hidden =[
    ];

    protected $casts =[
    ];

    public function user() {
        return $this->belongsTo(User::class,"user_id")->withTrashed();
    }

    public function installment()
    {
        return $this->hasOne(Installment::class, "transaction_id");
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, "transaction_id");
    }

    public function transactionItem()
    {
        return $this->hasOne(TransactionItem::class, "transaction_id");
    }

    public function payment_proofs()
    {
        return $this->hasMany(PaymentProof::class, "transaction_id");
    }
}