<?php

namespace App\Http\Resources\V1\Training;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Constants\Training\CourseItemGroupConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\TrainingLevelConstant;
use App\Constants\Training\TrainingAccessModuleConstant;
use App\Http\Resources\V1\Base\FileResource;

class CourseItemResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "group" => $this->group,
            "parent_id" => $this->parent_id,
            "is_header" => $this->is_header,
            "title" => $this->title,
            "title_japan" => $this->title_japan,
            "description" => $this->description,
            "index" => $this->index,
            "type" => $this->type,
            "program_type" => $this->program_type,
            "level_module" => $this->level_module,
            "access_module" => $this->access_module,
            "is_active" => $this->is_active,
            "weight_minimum" => $this->weight_minimum,
            "group_label" => CourseItemGroupConstant::LIST[$this->group] ?? null,
            "program_type_label" => TrainingProgramConstant::LIST[$this->program_type] ?? null,
            "level_module_label" => TrainingLevelConstant::LIST[$this->level_module] ?? null,
            "access_module_label" => TrainingAccessModuleConstant::LIST[$this->access_module] ?? null,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "course" => new CourseResource($this->whenLoaded("course")),
            "article" => new ArticleResource($this->whenLoaded("article")),
            "typeAssesment" => new ExamTemplateResource($this->whenLoaded("exam_template")),
            "event" => new EventResource($this->whenLoaded("event")),
            "materialContent" => ArticleResource::collection($this->whenLoaded("materialContent")),
            "content" => CourseItemResource::collection($this->whenLoaded("content")),
            "classVirtual" => CourseItemResource::collection($this->whenLoaded("classVirtual")),
            "classVirtual" => CourseItemResource::collection($this->whenLoaded("classVirtual")),
            "module" => new CourseItemResource($this->whenLoaded("module")),
            "file" => new FileResource($this->whenLoaded("file")),
            "assesmentStudent" => new UserCourseItemResource($this->whenLoaded("assesmentStudent")),
            "assesment" => CourseItemResource::collection($this->whenLoaded("assesment")),
            "assesmentStudentHistory" => UserCourseItemResource::collection($this->whenLoaded("assesmentStudentHistory"))

        ];
    }
}
