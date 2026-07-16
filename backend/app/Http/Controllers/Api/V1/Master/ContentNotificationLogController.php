<?php

namespace App\Http\Controllers\Api\V1\Master;

use App\Http\Resources\V1\Master\ContentNotificationLogResource;
use App\Models\Master\ContentNotificationLog;
use App\Services\BaseCrud\BaseCrud;

class ContentNotificationLogController extends BaseCrud
{

    public $model = ContentNotificationLog::class;
    public $resource = ContentNotificationLogResource::class;
    public $defaultOrder = "id";
    public $defaultSort = 'desc';
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

}
