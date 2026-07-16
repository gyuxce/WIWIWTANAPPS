<?php

namespace App\Console\Commands;

use App\Constants\ContentNotificationRepeatConstant;
use App\Constants\Finance\PaymentStatusConstant;
use App\Models\Base\User;
use App\Models\Finance\Payment;
use App\Models\Finance\Transaction;
use App\Models\Master\ContentNotification;
use App\Models\Master\Notification;
use Illuminate\Console\Command;
use App\Services\Sailfish\Sailfish;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SubscriptionStatusCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:subscription-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire all subscription based on passing grade period of due payment';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $user_ids = [];
        $records = DB::table('batch_users')->select('users.id')
            ->join('users', 'users.id', '=', 'batch_users.user_id')
            ->whereNull('users.deleted_at')
            ->whereNull('batch_users.deleted_at')
            ->whereNotNull('batch_users.transaction2_due_at')
            ->where(function ($query) {
                $query->whereNull('users.is_subscription_active')
                    ->orWhere('users.is_subscription_active', true);
            })
            ->where(function ($query) {
                $query->whereNull('batch_users.transaction2_status')
                    ->orWhere('batch_users.transaction2_status', '>', 2);
            })
            ->where('batch_users.transaction2_due_at', '<', $now)
            ->get();
        if (sizeof($records) === 0) { return; }
        foreach($records as $record) { $user_ids[] = $record->id; }

        //set subscription status to false
        User::whereIn('id', $user_ids)->update(['is_subscription_active' => false]);
    }
}