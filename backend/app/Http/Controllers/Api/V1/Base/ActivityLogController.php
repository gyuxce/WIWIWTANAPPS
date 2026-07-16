<?php

namespace App\Http\Controllers\Api\V1\Base;

use App\Http\Resources\V1\Base\ActivityLogGroupResource;
use App\Http\Resources\V1\Base\ActivityLogResource;
use App\Models\Base\ActivityLog;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Http\Request;

class ActivityLogController extends BaseCrud
{
    public $model = ActivityLog::class;
    public $resource = ActivityLogGroupResource::class;
    public $defaultOrder = "id";
    public $defaultSort = 'desc';
    public $modelKey = "uuid";
    public $cacheInMinute = 10;
    public $searchAble = ["description"];

    public function __successList($query)
    {
        $request = $this->requestData;
        $new_data = $query->map(function ($value) use ($request) {
            $queryBuilder = ActivityLog::with('user')
                ->whereDate('created_at', '>=', $value->group_date . ' 00:00:00')
                ->whereDate('created_at', '<=', $value->group_date . ' 23:59:59');
            
            if ($request->query('detail') == 'false') {
                $queryBuilder = $queryBuilder->limit(5);
            }

            $logs = $queryBuilder->get();
            
            return [
                "group_date" => $value->group_date,
                "total_count" => $value->total_count,
                "logs" => $logs,
            ];
        });
        
        $newPaginator = new \Illuminate\Pagination\LengthAwarePaginator(
            $new_data,
            $query->total(),
            $query->perPage(),
            $query->currentPage(),
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
        );


        $data = $this->resource::collection($newPaginator)->additional($this->__additionalCollection());

        if ($request->query("is_cache") == "1") {
            $key = Request::getRequestUri();

            Cache::put($key, $data, Carbon::now()->addMinutes($this->cacheInMinute));
        }

        return $data;
    }

    public function __prepareQueryList()
    {

        $this->query = $this->query->select(
            '*',
            \DB::raw('DATE(created_at) as group_date'),
            \DB::raw('count(id) as total_count'),
        )->groupBy('group_date')
        ->limit(3);

        return $this->query;
    }
}
