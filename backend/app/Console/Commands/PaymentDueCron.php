<?php

namespace App\Console\Commands;

use App\Constants\ContentNotificationRepeatConstant;
use App\Constants\Finance\PaymentStatusConstant;
use App\Helpers\DbHelper;
use App\Models\Finance\Payment;
use App\Models\Finance\Transaction;
use App\Models\Master\ContentNotification;
use App\Models\Master\Notification;
use Illuminate\Console\Command;
use App\Services\Sailfish\Sailfish;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PaymentDueCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:payment-due';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add transaction due date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $transaction_ids = [];
        $transaction_batch_user = [];
        $records = DB::table('transactions')->select('transactions.id', 'batch_users.id as batch_user_id')
            ->join('batch_users', 'batch_users.transaction2_id', '=', 'transactions.id')
            ->whereNull('transactions.deleted_at')
            ->whereNull('batch_users.deleted_at')
            ->whereNull('batch_users.transaction2_last_at')
            ->whereNull('batch_users.transaction2_due_at')
            ->where('transactions.total_left_amount', '>', 0)
            ->where('transactions.total', '!=', 'transactions.total_left_amount')
            ->get();
        if (sizeof($records) === 0) { return; }
        foreach($records as $record) { 
            $transaction_ids[] = $record->id; 
            $transaction_batch_user[$record->id] = $record->batch_user_id;
        }

        $update = [];
        $transactions = Transaction::whereIn('id', $transaction_ids)->with('payments')->get();
        foreach($transactions as $record) {
            if (empty($record->payments)) { continue; }
            $last = $record->payments->sortByDesc('updated_at')->first();
            if (!empty($last) && $last->status == PaymentStatusConstant::PAID) {
                $json_data = json_decode($last->data, true);
                $paid_at = $json_data['response']['chargeDetails'][0]['paidAt'] ?? $last->updated_at;
                $grace_days = env('PAYMENT_DUE_GRACE', 7);
                $due = Carbon::parse($paid_at)->addMonth()->addDays($grace_days);
                
                $update[] = [
                    'id' => $transaction_batch_user[$record->id],
                    'transaction2_last_at' => $last->updated_at,
                    'transaction2_due_at' => $due,
                ];
            }
        }

        //mass update
        if (!empty($update)) {
            bulkUpdateById('batch_users', $update, ['transaction2_last_at', 'transaction2_due_at']);
        }
    }
}