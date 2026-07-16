<?php

namespace App\Http\Resources\V1\Training;

use App\Constants\Training\ArticleTypeConstant;
use App\Http\Resources\V1\Base\FileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class ArticleResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),
            "created_by" => $this->created_by,
            "updated_by" => $this->updated_by,
            "deleted_by" => $this->deleted_by,
            "title" => $this->title,
            "description" => $this->description,
            "body_type" => $this->body_type,
            "body_type_label" => ArticleTypeConstant::LIST[$this->body_type] ?? null,
            "body_url" => $this->body_url,
            "duration" => $this->duration,
            "body_text" => $this->body_text,

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "cover" => new FileResource($this->whenLoaded("cover")),
            "file" => new FileResource($this->whenLoaded("file")),
            "progress" => new UserArticleResource($this->whenLoaded("userArticle")),
        ];
    }
}
