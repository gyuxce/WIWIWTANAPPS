<?php

namespace App\Http\Controllers\Api\V1\Master;

use App\Http\Resources\V1\Master\NotificationResource;
use App\Models\Master\Notification;
use App\Services\BaseCrud\BaseCrud;

class NotificationController extends BaseCrud
{

    public $model = Notification::class;
    public $resource = NotificationResource::class;
    public $defaultOrder = "id";
    public $defaultSort = 'desc';
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareQueryList()
    {
        if(auth()->user()->role == null) {
            $this->query = $this->query->where('user_id', auth()->user()->id ?? 0);
        }

        return $this->query;
    }

    public function read($id)
    {
        $data = $this->model::getOrFail($id);
        $update = $data;
        $update->update(['status' => 'read']);

        return response()->json(['status' => true, 'data' => new $this->resource($data)]);
    }

    public function totalNotifications()
    {
        $data = $this->model::query();
        $data = $data->where('user_id', auth()->user()->id ?? 0)->where('status','unread')->count();

        return response()->json(['status' => true, 'data' => $data]);
    }

}
