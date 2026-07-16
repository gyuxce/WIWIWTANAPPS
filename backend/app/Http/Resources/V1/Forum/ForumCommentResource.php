<?php

namespace App\Http\Resources\V1\Forum;


use App\Constants\ForumCommentConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Models\Forum\ForumComment;
use App\Constants\Forum\ForumCommentStatusReport;
use App\Models\Forum\ForumReport;

class ForumCommentResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $child =$this->child();
        if(request('parent_id') != null) {
            $resourceChild = self::collection(
                $this->whenLoaded("child")
            );
        } else {
            $resourceChild = self::collection(
                $this->whenLoaded("child", fn() => $child->with(['user'])->oldest()->get())
            );
        }
        return [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),

            "comment" => $this->comment,
            // "index" => $this->index,
            "parent_id" => $this->parent_id,
            "user_id" => $this->user_id,
            "post_id" => $this->post_id,
            "is_publish" => $this->is_publish,
            "is_publish_label" => ForumCommentConstant::LIST_STATUS_PUBLISH[$this->is_publish],
            "is_update" => $this->is_update,
            "is_like_by_user" => ForumComment::userLikeComment($this->id),
            "is_own_by_user" => ForumComment::isUserOwn($this->id),
            "like" => new ForumLikeResource(ForumComment::likeComment($this->id)),
            "status_report_label"=> ForumCommentStatusReport::LIST[$this->status_report] ?? null,

            "count_like" => $this->count_like == null ? 0 : $this->count_like,
            "count_report" => $this->count_report == null ? 0 : $this->count_report,
            "total_child" => $child->count(),

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),

            "user" => new UserResource($this->whenLoaded("user")),
            "replied" => new UserResource($this->whenLoaded("replied")),
            "post" => new ForumPostResource($this->whenLoaded("post")),
            // "child" => self::collection($this->whenLoaded("child")),
            "child" => $resourceChild,
            "parent" => new ForumPostResource($this->whenLoaded("parent")),
            "reports" => ForumReportResource::collection($this->whenLoaded("reports")),
        ];
    }

}