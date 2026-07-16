<?php

namespace App\Http\Controllers\Api\V1\Master;

use App\Constants\ContentNotificationTargetConstant;
use App\Http\Requests\Api\V1\Master\ApiContentNotificationRequest;
use App\Http\Resources\V1\Master\ContentNotificationResource;
use App\Models\Master\ContentNotification;
use App\Models\Master\ContentNotificationTarget;
use App\Models\Base\User;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Illuminate\Http\Request;

class ContentNotificationController extends BaseCrud
{

    use HasLogHelper;

    public $model = ContentNotification::class;
    public $resource = ContentNotificationResource::class;
    public $storeValidator = ApiContentNotificationRequest::class;
    public $updateValidator = ApiContentNotificationRequest::class;
    public $defaultOrder = "id";
    public $defaultSort = 'desc';
    public $modelKey = "uuid";
    public $cacheInMinute = 10;
    public $searchAble = ["name"];

    public function __prepareDataUpdate($data)
    {
        unset($data["created_by"]);

        return $data;
    }

    public function __afterStore()
    {
        if ($this->requestData['target_status'] == ContentNotificationTargetConstant::ALL_USER) {
            $targets = [];
            $users = User::whereNull('role_id')->where('is_active', 1)->get();
            foreach($users as $user) {
                $targets[] = [
                    'user_id' => $user->uuid
                ];

                $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
                $this->__insertLog($dataLog, "created", null);
            }
            $this->__insertNotificationTarget($targets, $this->row->id); 
        } else {
            if (count($this->requestData['target']) > 0) {
                # insert to content notification target
                $this->__insertNotificationTarget($this->requestData['target'], $this->row->id);
                $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
                $this->__insertLog($dataLog, "created", null);
            }
        }

    }

    public function __afterUpdate()
    {
        # delete recent content notification target
        $this->__deleteNotificationTarget($this->row->id);
        
        $this->__afterStore();
    }

    public function __beforeDestroy()
    {
        # delete recent content notification target
        $this->__deleteNotificationTarget($this->row->id);
    }

    public function __insertNotificationTarget($data, $cn_id)
    {
        foreach ($data as $key => $value) {
            $user_id = User::getId($value);
            $insert = [
                "user_id" => $user_id,
                "cn_id" => $cn_id,
            ];

            $notificationTarget = ContentNotificationTarget::query();
            $notificationTarget = $notificationTarget->create($insert);
        }
    }

    public function __deleteNotificationTarget($cn_id)
    {
        $notificationTarget = ContentNotificationTarget::where('cn_id', $cn_id)->get();
        if (count($notificationTarget) > 0) {
            $notificationTarget->each->delete();
        }
    }
}
