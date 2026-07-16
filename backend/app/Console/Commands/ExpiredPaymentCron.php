<?php

namespace App\Console\Commands;

use App\Constants\ContentNotificationRepeatConstant;
use App\Constants\Finance\PaymentStatusConstant;
use App\Models\Finance\Payment;
use App\Models\Master\ContentNotification;
use App\Models\Master\Notification;
use Illuminate\Console\Command;
use App\Services\Sailfish\Sailfish;
use Carbon\Carbon;

class ExpiredPaymentCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:expired-payment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire all the unpaid payments beyond their expiration date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $count = Payment::where('status', PaymentStatusConstant::UNPAID)->where('expired_at', '<', $now)->update([
            'status' => PaymentStatusConstant::FAILED
        ]);
        echo $count . " unpaid payments has been expired";
    }
}