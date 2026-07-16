<?php

namespace App\Http\Controllers\Api\V1\Base;

use App\Http\Requests\Api\V1\Base\ApiSettingRequest;
use App\Http\Resources\V1\Base\SettingResource;
use App\Models\Base\Setting;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Support\Str;

class SettingController extends BaseCrud
{
    public $model = Setting::class;
    public $resource = SettingResource::class;
    public $defaultOrder = "id";
    public $defaultSort = 'asc';
    public $modelKey = "uuid";
    public $cacheInMinute = 10;
    public $searchAble = ["value"];
    public $storeValidator = ApiSettingRequest::class;
    public $updateValidator = ApiSettingRequest::class;

    public function __prepareDataStore($data)
    {

        $data['slug'] = Str::slug($data['name'], '-');

        return $data;
    }

    public function __prepareDataUpdate($data)
    {
        return $this->__prepareDataStore($data);
    }

    public function updateSetting()
    {
        $req = app($this->updateValidator);

        foreach ($req->input('settings') as $value) {
            $this->updateSettingBySlug($value['slug'], $value['value']);
        }

        return $this->__success();
    }

    private function updateSettingBySlug($slug, $value)
    {
        $setting = Setting::where('slug', $slug)->first();
        if (!$setting) {
           return false;
        }

        $setting->update([
            'value' => $value
        ]);

        return true;
    }
}
