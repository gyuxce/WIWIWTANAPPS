<?php

namespace App\Http\Resources\V1\Training;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class UserCourseResource extends JsonResource {

public function toArray(Request $request): array{

return [
"id"=> $this->uuid,
"uuid"=> $this->uuid,
"created_at"=> convertToTimezone($this->created_at),
"updated_at"=> convertToTimezone($this->updated_at),
"deleted_at"=> convertToTimezone($this->deleted_at),
"created_by"=> $this->created_by,
"updated_by"=> $this->updated_by,
"deleted_by"=> $this->deleted_by,
"user_id"=> $this->user_id,
"course_id"=> $this->course_id,
"acquired_at"=> convertToTimezone($this->acquired_at),
"started_at"=> convertToTimezone($this->started_at),
"finished_at"=> convertToTimezone($this->finished_at),
"last_activity_at"=> convertToTimezone($this->last_activity_at),
"item_finished"=> $this->item_finished,
"exam_score_total"=> $this->exam_score_total,
"exam_score_achieved"=> $this->exam_score_achieved,
"exam_score_normalized"=> $this->exam_score_normalized,
"status"=> $this->status,

"createdBy"=> new UserResource($this->whenLoaded("createdBy")),
"updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
"deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
"user" => new UserResource($this->whenLoaded("user")) ,
"course" => new CourseResource($this->whenLoaded("course")) ,
];
}

}
