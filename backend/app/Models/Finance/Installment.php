<?php

namespace App\Models\Finance;

use App\Constants\Finance\PaymentStatusConstant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Base\File;
use Carbon\Carbon;
use Complex\Functions;

class Installment extends Model {

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'installments';

    protected $fillable =[
        "uuid",
        "transaction_id",
        "period_type",
        "period_length",
        "payment_first_id",
        "payment_first_at",
        "payment_next_id",
        "payment_next_at",
        "payment_last_id",
        "payment_last_at",
        "is_paid",
        "index",
        "file_id",
        "file2_id",
        "file3_id",
    ];

    protected $hidden =[
    ];

    protected $casts =[
        "is_paid"=> "boolean",
    ];

    public function transaction() {
        return $this->belongsTo(Transaction::class,"transaction_id")->withTrashed();
    }

    public function file() {
        return $this->belongsTo(File::class,"file_id")->withTrashed();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, "installment_id");
    }

    public function payment_proofs()
    {
        return $this->hasMany(PaymentProof::class, "installment_id");
    }

    public static function calculateNextInstallment(Transaction $transaction, $debug_add_months = 0)
    {
        //load required relationships
        $transaction->loadMissing(['installment']);

        $now = Carbon::now();
        if ($debug_add_months > 0) { $now->addMonths($debug_add_months); }
        $start = Carbon::parse($transaction->issued_at)->startOfMonth()->startOfDay();

        //cancel if transaction has been paid or not into the 1st period yet
        if ($transaction->total_left_amount == 0 || $now < $start) { return 0; }

        return $transaction->total_amount / $transaction->installment->period_length;
    }

    // public static function calculateNextInstallment(Transaction $transaction, $debug_add_months = 0)
    // {
    //     //load required relationships
    //     $transaction->loadMissing(['payments', 'installment']);

    //     $now = Carbon::now();
    //     if ($debug_add_months > 0) { $now->addMonths($debug_add_months); }
    //     $start = Carbon::parse($transaction->issued_at)->startOfMonth()->startOfDay();

    //     //cancel if transaction has been paid or not into the 1st period yet
    //     if ($transaction->total_left_amount == 0 || $now < $start) { return 0; }

    //     $length = $transaction->installment->period_length;
    //     $monthly = $transaction->total_amount / $length;
    //     $debt = 0;

    //     for($i = 1; $i <= $length; $i++) {
    //         $period_start = $start->copy()->addMonths($i - 1)->startOfMonth()->startOfDay();

    //         //skip future periods
    //         if ($now < $period_start) { break; }

    //         $period_end = $start->copy()->addMonths($i - 1)->endOfMonth()->endOfDay();

    //         //check for latest payments this period
    //         $latest = $transaction->payments->where('created_at', '>=', $period_start)->where('created_at', '<=', $period_end)->sortByDesc('created_at')->first();

    //         //reset debt if this period payment has been paid
    //         if (!empty($latest) && $latest->status == PaymentStatusConstant::PAID) { $debt = 0; continue; }

    //         //last period and has no payment/failed payment
    //         if ((!empty($latest) && $latest->status != PaymentStatusConstant::PAID) && $i == $length) { return $transaction->total_left_amount; }
            
    //         //past, no payment/unpaid payment = added debt
    //         if ($now > $period_end && (empty($latest) || $latest->status != PaymentStatusConstant::PAID)) { $debt += $monthly; continue; }

    //         //present, no payment/failed latest payment = due
    //         if ($now >= $period_start && $now <= $period_end && (empty($latest) || $latest->status == PaymentStatusConstant::FAILED)) { return $monthly + $debt; }
    //     }

    //     return 0;
    // }
}