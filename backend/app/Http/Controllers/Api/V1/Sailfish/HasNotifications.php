<?php

namespace App\Http\Controllers\Api\V1\Sailfish;

use App\Models\Master\Notification;
use App\Services\Sailfish\Sailfish;

# body sailfish
/**
 * 
 * {
 *     "tokens": [
 *         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU5NDE0MTA1LTUyNDgtNGRhMC05MGZmLTFmMGUyNWE0OTNhZCIsInVzZXJfaWQiOjMsImlzc3VlZF9hdCI6IjIwMjMtMTEtMDlUMDQ6MDg6MjIuODk5MzUxMzUzWiIsImV4cGlyZWRfYXQiOiIyMDIzLTExLTEwVDA3OjA4OjIyLjg5OTM1MTYyWiJ9.c26cJgH0yadhRoXq6mPjLSgU6L8MsYO4ZfO3YBiUb3g"
 *     ],
 *     "title": "lol",
 *     "body": "body",
 *     "data": {
 *         "params": "params"

 *     },
 *     "image": "https://crowdbotics.ghost.io/content/images/size/w1000/2021/02/ReactNativeFeaturedImage.png"
 * }
 * 
 */
# body sailfish


trait HasNotifications
{
    protected $auth;

    /**
     * -----------------------
     * ## push notification ##
     * -----------------------
     */
    public function __pushNotification($user, array $notifdata, $isPriority = 0)
    {
        $sailfish = new Sailfish();

        $data = [];
        $fcmToken = [];

        if (isset($user->fcm_tokens) and count($user->fcm_tokens) > 0) {
            $token = $user->fcm_tokens ?? [];
            foreach ($token as $key => $value) {
                $fcmToken[] = $value->token;
            }

            $input = [
                "tokens" => $fcmToken,
                "title" => $notifdata['title'],
                "body" => $notifdata['body'],
                "data" => $notifdata['data'],
            ];

            $res = $sailfish->sendNotificationFirebase($input);
            $data = json_decode($res->content(), true);

            # insert TO table notification
            $store = $input;
            $store['priority'] = $isPriority;
            $store['category'] = $notifdata['data']['module'];
            $store['user_id'] = $user->id;
            unset($store['tokens']);

            $this->__storeNotification($store);
        }

        return $data;
    }

    public function __storeNotification($data)
    {
        $input = $data;
        $q = Notification::query();
        $q = $q->create($input);

        return true;
    }
}
