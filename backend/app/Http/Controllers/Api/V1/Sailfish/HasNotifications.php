<?php

namespace App\Http\Controllers\Api\V1\Sailfish;

use App\Models\Master\Notification;
use App\Services\Sailfish\Sailfish;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FirebaseNotification;

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
        $data = [];

        if (isset($user->fcm_tokens) and count($user->fcm_tokens) > 0) {
            $fcmToken = [];
            foreach ($user->fcm_tokens as $value) {
                $fcmToken[] = $value->token;
            }

            try {
                $messagingData = [];
                foreach (($notifdata['data'] ?? []) as $key => $value) {
                    $messagingData[$key] = (string) $value;
                }

                $message = CloudMessage::new()
                    ->withNotification(FirebaseNotification::create($notifdata['title'], $notifdata['body']))
                    ->withData($messagingData);

                $report = app(Messaging::class)->sendMulticast($message, $fcmToken);
                $data = [
                    'success' => $report->successes()->count(),
                    'failures' => $report->failures()->count(),
                ];
            } catch (\Throwable $e) {
                Log::error('Firebase push notification failed: ' . $e->getMessage());
            }
        }

        # insert TO table notification regardless of whether push succeeded
        $store = [
            'title' => $notifdata['title'],
            'body' => $notifdata['body'],
            'data' => $notifdata['data'] ?? [],
            'priority' => $isPriority,
            'category' => $notifdata['data']['module'] ?? null,
            'user_id' => $user->id,
        ];

        $this->__storeNotification($store);

        return $data;
    }

    public function __storeNotification($data)
    {
        $input = $data;
        $q = Notification::query();
        $q = $q->create($input);

        return true;
    }

    /**
     * -----------------------
     * ## email notification ##
     * -----------------------
     */
    public function __sendEmailNotification($user, $template, $title, $params = [])
    {
        if (empty($user->email)) {
            return false;
        }

        try {
            $sailfish = new Sailfish();
            $bodySailfish = [
                'type' => 'email',
                'recipient' => $user->email,
                'recipient_name' => $user->name,
                'title' => $title,
                'body' => $title,
                'template' => $template,
                'template_params' => array_merge([
                    'name' => $user->name,
                    'subject' => $title,
                ], $params),
            ];
            $sailfish->push($bodySailfish);
        } catch (\Throwable $e) {
            Log::error('Email notification failed: ' . $e->getMessage());
        }

        return true;
    }
}
