<?php

namespace App\Http\Resources\V1\Forum;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Models\Forum\ForumPost;
use App\Constants\Forum\ForumPostStatusReport;

class ForumPostResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "title" => $this->title,
            "description" => $this->description,
            "index" => $this->index,
            "is_draft" => $this->is_draft,
            "is_publish" => $this->is_publish,
            "count_like" => $this->count_like,
            "count_comment" => $this->count_comment,
            "count_report" => $this->count_report,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),
            "status_report_label"=> ForumPostStatusReport::LIST[$this->status_report] ?? null,
            "deleted_reason" => $this->deleted_reason,
            "is_like_by_user" => ForumPost::userLikePost($this->id),
            "like" => new ForumLikeResource(ForumPost::likePost($this->id)),
            // "is_like" => ForumPost::userLikePost($this->id),
            "user" => new UserResource($this->whenLoaded("user")),
            "likes" => ForumLikeResource::collection($this->whenLoaded("likes")),
            "comments" => ForumCommentResource::collection($this->whenLoaded("comments")),
            "parentComment" => ForumCommentResource::collection($this->whenLoaded("parentComment")),
            "reports" => ForumReportResource::collection($this->whenLoaded("reports")),
            "topic" => new ForumTopicResource($this->whenLoaded("topic")),
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
        ];
    }
}