<?php

namespace App\Http\Resources\V1\Training;

use App\Constants\Training\TrainingAccessModuleConstant;
use App\Constants\Training\TrainingLevelConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\UserCourseItemStatusConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class StudentReportResource extends JsonResource
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
            "link" => $this->link,
            "user_name" => $this->user_name,
            "category_module" => $this->category_module,
            "type_assesment" => $this->type_assesment,
            "module_name" => $this->module_name,
            "category_id" => $this->category_id,
            "assesment_id" => $this->assesment_id,
            "module_id" => $this->module_id,
            "module_program_type" => $this->module_program_type,
            "module_level_module" => $this->module_level_module,
            "access_module" => $this->module_access_module,
            "program_type_label" => TrainingProgramConstant::LIST[$this->module_program_type] ?? null,
            "level_module_label" => TrainingLevelConstant::LIST[$this->module_level_module] ?? null,
            "access_module_label" => TrainingAccessModuleConstant::LIST[$this->module_access_module] ?? null,

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "user" => new UserResource($this->whenLoaded("user")),
            "course" => new CourseResource($this->whenLoaded("course")),
            "item" => new CourseItemResource($this->whenLoaded("item")),
            "userExam" => new UserExamResource($this->whenLoaded("userExam")),

        ];
    }
}
