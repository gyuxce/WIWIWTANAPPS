<?php

namespace App\Http\Resources\V1\Base;

use App\Models\Base\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "status"=> $this->status,
            "status_label"=> Role::LABEL_STATUS[$this->status] ?? null,
            "user"=> $this->users_count,
            "menus" => RoleMenuResource::collection($this->whenLoaded('roleMenus'))
//            "createdBy"=> new UserResource($this->whenLoaded("created_at")),
//            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
//            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
        ];
    }
}
