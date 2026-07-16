<?php

namespace App\Services\BaseCrud\Traits;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Request;

trait HasCrudSuccessResult
{
    public function __successList($query)
    {
        $request = $this->requestData;

        $data = $this->resource::collection($query)->additional($this->__additionalCollection());

        if ($request->query("is_cache") == "1") {
            $key = Request::getRequestUri();

            Cache::put($key, $data, Carbon::now()->addMinutes($this->cacheInMinute));
        }

        return $data;
    }

    public function __successShow()
    {
        $request = $this->requestData;

        $data = new $this->resource($this->row);

        if ($request->query("is_cache") == "1") {
            $key = Request::getRequestUri();

            Cache::put($key, $data, Carbon::now()->addMinutes($this->cacheInMinute));
        }

        return $data;
    }

    public function __successUpdate()
    {
        return new $this->resource($this->row);
    }

    public function __successStore()
    {
        return new $this->resource($this->row);
    }

    public function __successDestroy()
    {
        return $this->__success();
    }

    public function __successBulkDestroy()
    {
        return $this->__success();
    }


    public function __success()
    {
        return ['success' => true];
    }

    public function __additionalCollection()
    {
        $lastUpdated = $this->model::query();
        $lastUpdated = $lastUpdated->orderBY('updated_at', 'desc')->first();
        return [
            "last_updated" => $lastUpdated && $lastUpdated->updated_at != null ? $lastUpdated->updated_at : null
        ];
    }
}