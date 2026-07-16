<?php

namespace App\Http\Controllers\Api\V1\Base;

use App\Http\Resources\V1\Base\MenuResource;
use App\Http\Resources\V1\Base\RoleResource;
use App\Models\Base\Menu;
use App\Models\Base\Role;
use App\Services\BaseCrud\BaseCrud;

class MenuController extends BaseCrud {
    public $model = Menu::class;

    public $resource = MenuResource::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;
    public $searchAble = ["name"];

}
