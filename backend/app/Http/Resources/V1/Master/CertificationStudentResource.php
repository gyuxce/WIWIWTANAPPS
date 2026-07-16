<?php

namespace App\Http\Resources\V1\Master;

use App\Constants\CertificationStatusConstant;
use App\Constants\CertificationStudentStatusConstant;
use App\Http\Resources\V1\Base\FileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;

class CertificationStudentResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,

            "name" => $this->name,
            "cert_date" => $this->cert_date,
            "location" => $this->location,
            "status" => $this->status,
            "status_label" => CertificationStudentStatusConstant::LIST[(int) $this->status] ?? null,
            "percent" => $this->status != CertificationStudentStatusConstant::WAITING ? 100 : 0,

            "user" => new UserResource($this->whenLoaded("user")),
            "certification" => new CertificationResource($this->whenLoaded("certification")),
            "file" => new FileResource($this->whenLoaded("file")),

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),

            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
        ];
    }
}
