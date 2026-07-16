<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Constants\Training\UserCourseItemStatusConstant;
use App\Models\Training\UserCourseItem;
use App\Http\Resources\V1\Training\UserCourseItemResource;
use App\Http\Requests\Api\V1\Training\ApiUserCourseItemRequest;
use App\Http\Requests\Api\V1\Training\ApiUserCourseItemUpdateStatusRequest;
use App\Models\Training\UserExam;
use App\Repositories\UserExamRepository;
use Illuminate\Http\Request;
use App\Services\BaseCrud\BaseCrud;

class UserCourseItemController extends BaseCrud
{
    public $model = UserCourseItem::class;
    public $resource = UserCourseItemResource::class;
    public $storeValidator = ApiUserCourseItemRequest::class;
    public $updateValidator = ApiUserCourseItemRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "id";
    public $repo;
    public $cacheInMinute = 10;

    public function __construct()
    {
        $this->repo = new UserExamRepository();
    }

    public function updateStatus(Request $request) {
        app(ApiUserCourseItemUpdateStatusRequest::class);

        $exam_id = UserExam::getId($request->id);
        $query = $this->model::where('user_exam_id', $exam_id)->firstOrFail();
        if ($request->status == UserCourseItemStatusConstant::WAITING) {
            $this->repo->calculateResult($exam_id);
        }
        $query->update(['status' => $request->status]);

        return response()->json(["message" => "OK"], 200);
    }
}
