<?php

namespace App\Models\Finance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\File;
use App\Models\Base\User;

class PaymentProof extends Model {

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'payment_proofs';

    protected $fillable =[
        "uuid",
        "user_id",
        "payment_id",
        "transaction_id",
        "installment_id",
        "date",
        "adapter",
        "currency_code",
        "amount",
        "from_bank_id",
        "from_account_number",
        "from_account_name",
        "to_bank_id",
        "to_account_number",
        "to_account_name",
        "status",
        "file_id",
    ];

    protected $hidden =[
    ];

    protected $casts =[
    ];

    public function payment() {
        return $this->belongsTo(Payment::class,"payment_id")->withTrashed();
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

    public function user() {
        return $this->belongsTo(User::class,"user_id")->withTrashed();
    }

}