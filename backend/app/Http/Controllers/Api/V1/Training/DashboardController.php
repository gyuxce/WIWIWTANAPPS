<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Constants\Training\InterviewStatusConstant;
use App\Models\Base\User;
use App\Repositories\DashboardRepository;
use App\Services\BaseCrud\BaseCrud;

class DashboardController extends BaseCrud
{

    public $model = User::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function progress()
    {
        $reporitory = new DashboardRepository();
        return response()->json([
            'data' => [
                'pratest' => $reporitory->pratest(),
                'interview' => $reporitory->interview(),
                'certification' => $reporitory->certification(),
                'training' => $reporitory->training(),
                'payment' => $reporitory->payment(),
            ]
        ]);
    }

    public function statisticCards()
    {
        $repository = new DashboardRepository();
        return response()->json([
            'data' => [
                'total_students' => $repository->totalStudent(),
                'average_settlement' => null,
                'average_user_screentime' => $repository->averageUserScreentime(),
            ]
        ]);
    }
}
