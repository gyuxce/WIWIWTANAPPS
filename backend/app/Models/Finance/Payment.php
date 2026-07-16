<?php

namespace App\Models\Finance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\File;

class Payment extends Model {

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'payments';

    protected $fillable =[
        "uuid",
        "transaction_id",
        "installment_id",
        "expired_at",
        "adapter",
        "number",
        "number_ref",
        "currency_code",
        "amount",
        "fee",
        "tax",
        "total",
        "from_bank_id",
        "from_account_number",
        "from_account_name",
        "to_bank_id",
        "to_account_number",
        "to_account_name",
        "file_id",
        "status",
        "index",
        "data"
    ];

    protected $hidden =[
    ];

    protected $casts =[
    ];

    public function paymentProof()
    {
        return $this->hasOne(PaymentProof::class, "payment_id");
    }

    public function transaction() {
        return $this->belongsTo(Transaction::class,"transaction_id")->withTrashed();
    }

    public function installment() {
        return $this->belongsTo(Installment::class,"installment_id")->withTrashed();
    }

    public function fromBank() {
        return $this->belongsTo(Bank::class,"from_bank_id")->withTrashed();
    }

    public function toBank() {
        return $this->belongsTo(Bank::class,"to_bank_id")->withTrashed();
    }

    public function file() {
        return $this->belongsTo(File::class,"file_id")->withTrashed();
    }

    public function paymentDetail()
    {
        return $this->hasOne(PaymentDetail::class, "payment_id");
    }


}