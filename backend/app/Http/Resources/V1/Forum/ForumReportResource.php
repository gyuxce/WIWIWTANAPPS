<?php

namespace App\Http\Resources\V1\Forum;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Constants\Forum\ForumReportTypeConstant;
use App\Constants\Forum\ForumReportStatusConstant;

class ForumReportResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "notes" => $this->notes,
            "status" => $this->status,
            "status_label" => ForumReportStatusConstant::LIST[$this->status] ?? null,
            "type" => $this->type,
            "type_label" => ForumReportTypeConstant::LIST[$this->type] ?? null,
            "user" => new UserResource($this->whenLoaded("user")),
            "post" => new ForumPostResource($this->whenLoaded("post")),
            "comment" => new ForumCommentResource($this->whenLoaded("comment")),
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
        ];
    }
}
