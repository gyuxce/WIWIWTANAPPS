<?php

namespace App\Http\Controllers\Api\V1\Sailfish;

use App\Http\Requests\Api\V1\Sailfish\ApiFcmRequest;
use App\Http\Requests\Api\V1\Sailfish\ApiPushNotificationRequest;
use App\Models\Base\FcmToken;
use App\Models\Base\User;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Http\Request;
use App\Services\Sailfish\Sailfish;

class FcmController extends BaseCrud
{
    public $model = FcmToken::class;
    public $storeValidator = ApiFcmRequest::class;
    public $storePushValidator = ApiPushNotificationRequest::class;
    private $sailfish;

    public function __construct()
    {
        $this->sailfish = new Sailfish();
    }

    public function updateFcmToken(Request $request)
    {
        $req = app($this->storeValidator);

        $this->requestData = $req;

        $input = $this->requestData->all();
        $input['user_id'] = User::getId($this->requestData->get('user_id'));

        # hard delete FCM token if same FCM token
        $oldFcm = $this->model::where('user_id', $input['user_id'])->where('token', $input['token'])->where('os', $input['os'])->get();
        if(count($oldFcm) != 0) {
            $oldFcm->each->delete();
        }

        $res = $this->sailfish->fcmStore($input);
        $data = json_decode($res->content(), true);

        if($data['status'] == 'success') {
            $data['data']['user_id'] = User::getFirst($data['data']['user_id'], 'id')->uuid;
            return $data;
        } else {
            return $data;
        }
    }

    public function pushNotification(Request $request)
    {
        $req = app($this->storePushValidator);

        $this->requestData = $req;

        $input = $this->requestData->all();

        $res = $this->sailfish->sendNotificationFirebase($input);
        $data = json_decode($res->content(), true);

        if($data['status'] == 'success') {
            if(isset($data['data']['token_error']) and $data['data']['token_error'] != null) {
                return response()->json(['data' => null, "status" => false, "message" => "token not valid"]);
            }
            return $data;
        } else {
            return $data;
        }
    }

}
