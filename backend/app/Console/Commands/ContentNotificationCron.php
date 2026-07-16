<?php

namespace App\Console\Commands;

use App\Constants\ContentNotificationRepeatConstant;
use App\Models\Master\ContentNotification;
use App\Models\Master\Notification;
use Illuminate\Console\Command;
use App\Services\Sailfish\Sailfish;

class ContentNotificationCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:content-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run Content Notification';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        /**
         * NOTES:
         * JALANKAN SCHEDULER PER MENIT SAJA. KARENA ADA PENGECEKAN TANGGAL - JAM - MENIT
         */
        $cn = ContentNotification::where('is_active', 1)->where('status', 0)->get();

        if (count($cn) > 0) {
            foreach ($cn as $key => $value) {
                $repeat = $value->repeat_each;
                $dateNow = date("Y-m-d H:i", strtotime("+7 hours"));
                $dateSend = date("Y-m-d H:i", strtotime($value->send_at));
                $data = $value;

                # IF CONDITION : timenow same datesend
                if ($dateNow == $dateSend) {
                    if ($repeat == ContentNotificationRepeatConstant::ONCE) {
                        # ONCE (1)
                        # insert to log
                        $this->saveCNLog($data);
                        # update is_active and status
                        $value->update(['is_active' => 0, 'status' => 1]);
                        echo "RUN -- ID:" . $value->uuid . " [ONCE]";
                    } elseif ($repeat == ContentNotificationRepeatConstant::ONCE_A_WEEK) {
                        # SEMINGGU SEKALI (2)
                        $dayNow = date("D", strtotime($dateNow));
                        $daySend = date("D", strtotime($dateSend));
                        if ($dayNow == $daySend) {
                            # insert to log
                            $this->saveCNLog($data);
                        }
                        echo "RUN -- ID:" . $value->uuid . " [WEEK]";
                    } elseif ($repeat == ContentNotificationRepeatConstant::ONCE_A_MONTH) {
                        # SEBULAN SEKALI (3)
                        $dayNow = date("d", strtotime($dateNow));
                        $daySend = date("d", strtotime($dateSend));
                        if ($dayNow == $daySend) {
                            # insert to log
                            $this->saveCNLog($data);
                        }
                        echo "RUN -- ID:" . $value->uuid . " [MONTH]";
                    }
                } else {
                    echo "NOTING --- RUN ---";
                }
            }
        } else {
            echo "NOTING --- RUN ---";
        }


    }

    public function saveCNLog($data)
    {
        $sailfish = new Sailfish();
        $fcmToken = [];
        $target = $data->targets;
        $user = [];
        if (count($target) == 0) {
            $user = \App\Models\Base\User::whereNull('role_id')->get();
        } else {
            foreach ($target as $key => $value) {
                $user[] = $value->user;
            }
        }

        if (count($user) > 0) {
            foreach ($user as $key => $value) {
                if ($value->fcm_tokens != null) {
                    foreach ($value->fcm_tokens as $kt => $kv) {
                        $fcmToken[] = $kv->token;
                    }
                }
                $q = \App\Models\Master\ContentNotificationLog::query();
                $qinsert = $q->create([
                    "cn_id" => $data->id,
                    "user_id" => $value->id
                ]);

                 # save notification
                 $store = [];
                 $store['priority'] = 1;
                 $store['category'] = "content-notification";
                 $store['user_id'] = $value->id;
                 $store['title'] = $data->name;
                 $store['body'] = $data->description;
                 $store['data'] = [
                     "module" => "content-notification",
                     "module_id" => $data->uuid,
                     "title" => $data->name
                 ];

                 $qn = Notification::query();
                 $qn = $qn->create($store);
            }

            # send to firebase
            if (count($fcmToken) > 0) {
                $input = [
                    "tokens" => $fcmToken,
                    "title" => $data->name,
                    "body" => $data->description,
                    "data" => ['params' => "params"]
                ];

                $res = $sailfish->sendNotificationFirebase($input);
                $data = json_decode($res->content(), true);
            }
        }
    }
}