<?php

namespace App\Repositories\Training;

use App\Constants\Training\CourseItemGroupConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\UserCourseItemStatusConstant;
use App\Models\Training\Course;
use App\Models\Training\CourseItem;
use App\Models\Training\UserCourse;
use App\Models\Training\UserCourseItem;
use App\Repositories\BaseRepository;
use Carbon\Carbon;

class UserCourseItemRepository extends BaseRepository
{
    public function createUserCourseItemFromPayment($dataUser)
    {
        $courseItems = CourseItem::where('exam_template_id', ExamTemplateConstant::ASSESMENT_CONVERSATION)->get();
        if ($courseItems) {
            $dtoUserCourse = [
                "user_id" => $dataUser->id,
                "course_id" => $courseItems[0]->course_id,
                "acquired_at" => now(),
            ];
            UserCourse::create($dtoUserCourse);

            foreach($courseItems as $courseItem) {
                $dtoUserCourseItem = [
                    "user_id" => $dataUser->id,
                    "course_id" => $courseItem->course_id,
                    "item_id" => $courseItem->id,
                    "status" => UserCourseItemStatusConstant::PROGRESS,
                    "weight_minimum" => $courseItem->weight_minimum,
                ];
                UserCourseItem::create($dtoUserCourseItem);
            }
        }
        return true;
    }

    public function createUserCourseItem($id, $dataUser)
    {
        $courseItem = CourseItem::findOrFail($id);
        if ($courseItem) {
            $uc = UserCourse::where('user_id', $dataUser->id)->where('course_id', $courseItem->course_id)->first();
            if (!$uc) {
                $dtoUserCourse = [
                    "user_id" => $dataUser->id,
                    "course_id" => $courseItem->course_id,
                    "acquired_at" => now(),
                ];
                UserCourse::create($dtoUserCourse);
            }

            $uci = UserCourseItem::where('user_id', $dataUser->id)
                                 ->where('course_id', $courseItem->course_id)
                                 ->where('item_id', $courseItem->id)
                                 ->first();
            if (!$uci) {
                $dtoUserCourseItem = [
                    "user_id" => $dataUser->id,
                    "course_id" => $courseItem->course_id,
                    "item_id" => $courseItem->id,
                    "status" => UserCourseItemStatusConstant::PROGRESS,
                    "weight_minimum" => $courseItem->weight_minimum,
                ];
                UserCourseItem::create($dtoUserCourseItem);
            }
        }
        return true;
    }
}