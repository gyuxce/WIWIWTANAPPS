<?php

namespace App\Http\Resources\V1\Training;

use App\Constants\Training\UserCourseItemScheduleStatus;
use App\Constants\Training\UserCourseItemStatusConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class UserCourseItemResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),
            "progress" => $this->progress,
            "event_id" => $this->event_id,
            "is_skipped" => $this->is_skipped,
            "weight_final" => $this->weight_final,
            "weight_total" => $this->weight_total,
            "weight_minimum" => $this->weight_minimum,
            "weight_maximum" => $this->weight_maximum,
            "working_date" => convertToTimezone($this->working_date),
            "status" => $this->status,
            "status_label" => UserCourseItemStatusConstant::LIST[$this->status] ?? null,
            "is_scheduled" => $this->is_scheduled,
            "is_scheduled_label" => UserCourseItemScheduleStatus::LIST[$this->is_scheduled] ?? null,
            "link" => $this->link,

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "user" => new UserResource($this->whenLoaded("user")),
            "course" => new CourseResource($this->whenLoaded("course")),
            "item" => new CourseItemResource($this->whenLoaded("item")),
            "user_exam_question" => UserExamQuestionResource::collection($this->whenLoaded("user_exam_question")),
            "userExam" => new UserExamResource($this->whenLoaded("userExam")),
        ];
    }
}
