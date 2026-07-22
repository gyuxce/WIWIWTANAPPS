<?php

namespace App\Repositories\Training;

use App\Constants\Training\CourseItemGroupConstant;
use App\Models\Training\Course;
use App\Models\Training\CourseItem;
use App\Repositories\BaseRepository;
use Carbon\Carbon;
use App\Constants\Training\UserCourseItemStatusConstant;
use Illuminate\Support\Facades\Auth;

class CourseItemRepository extends BaseRepository
{
    public function getMobileModuleProgress()
    {
        $datas = Course::withCount(['articles as materi_count', 'articles as materi_count_progress' => function ($q) {
            $q->whereHas('userArticle');
        }])->with('cover')->get();

        foreach ($datas as $course) {
            $course->virtual_count = 0;
            $course->virtual_count_progress = 0;
            $course->assesment_count = 0;
            $course->assesment_count_progress = 0;

            $parentCourseItemIds = CourseItem::where('course_id', $course->id)
                ->where('is_header', true)
                ->where('program_type', Auth::user()?->training_program)
                ->pluck('id');

            if ($parentCourseItemIds->isNotEmpty()) {
                $courseItems = CourseItem::where('course_id', $course->id)
                    ->whereIn('parent_id', $parentCourseItemIds)
                    ->with('event', 'assesmentStudent')
                    ->get();

                if (!empty($courseItems)) {
                    foreach ($courseItems as $item) {
                        if ($item->group === CourseItemGroupConstant::COURSE_GROUP_CLASS && $item->event_id !== null) {
                            $course->virtual_count++;
                            if ($item->event && Carbon::parse($item->event->started_at)->lt(now())) {
                                $course->virtual_count_progress++;
                            }
                        }

                        if ($item->group === CourseItemGroupConstant::COURSE_GROUP_ASSESMENT) {
                            $course->assesment_count++;
                            if ($item->assesmentStudent) {
                                if ($item->assesmentStudent->status === UserCourseItemStatusConstant::FINISHED) {
                                    $course->assesment_count_progress++;
                                }
                            }
                        }
                    }
                }
            }
        }
        return $datas;
    }
}
