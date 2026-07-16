<?php

namespace App\Http\Controllers\Api\V1\Base;

use App\Http\Requests\Api\V1\Base\ApiRoleRequest;
use App\Http\Resources\V1\Base\RoleResource;
use App\Models\Base\Menu;
use App\Models\Base\Role;
use App\Models\Base\RoleMenu;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Illuminate\Http\Request;

class RoleController extends BaseCrud {
    use HasLogHelper;
    public $model = Role::class;

    public $resource = RoleResource::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;
    public $searchAble = ["name"];
    public $storeValidator = ApiRoleRequest::class;
    public $updateValidator = ApiRoleRequest::class;

    public function __prepareQueryList()
    {
        return $this->query->withCount('users');
    }

    public function __prepareDataStore($data)
    {
        return $data;
    }

    public function __afterStore()
    {
        if(count($this->requestData["role_menu"]) > 0) {
            foreach ($this->requestData["role_menu"] as $value) {
                $rolePermission = new RoleMenu();
                $rolePermission->fill([
                    "role_id" => $this->row->id,
                    "menu_id" => Menu::getId($value["menu_id"]),
                ]);
                $rolePermission->save();
            }
        }

        if (request()->method() == "POST") {
            # insert to log
            $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
            $this->__insertLog($dataLog, "created", null);
        }
    }

    public function __prepareDataUpdate($data)
    {
        unset($data["created_by"]);
        return $data;
    }

    public function __afterUpdate()
    {
        $roleMenu = $this->row->roleMenus();
        $roleMenu->delete();

        $this->__afterStore();

        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function filter(Request $request) {
        $this->requestData = $request;

        if ($ress = $this->__prepareCacheResult()) {
            return $ress;
        }

        $this->query = $this->model::query();

        $this->__prepareQueryRelationList();

        $this->__prepareQueryList();

        $this->__prepareQuerySearchAbleList();

        $this->__prepareQueryOptionsList();

        $this->__prepareQuerySortOrderList();

        $this->__prepareQueryLimitList();

        $query = $this->__prepareQueryListType();

        $this->__prepareLoadRelation($query);

        return $this->__successList($query);
    }
}
