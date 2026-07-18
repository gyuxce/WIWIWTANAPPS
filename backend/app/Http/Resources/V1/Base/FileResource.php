<?php

namespace App\Http\Resources\V1\Base;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use Illuminate\Support\Str;


class FileResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $localUrl = $this->resolveLocalUrl();
        $url = $this->resolveUrl($localUrl);

        return [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "adapter" => $this->adapter,
            "filename" => $this->filename,
            "url" => $url,
            "local_url" => $localUrl,
            "height" => $this->height,
            "width" => $this->width,
            "size" => $this->size,

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
        ];
    }

    private function resolveUrl(?string $localUrl): ?string
    {
        if ($localUrl && in_array($this->adapter, ["local", "public"], true)) {
            return $localUrl;
        }

        return $this->url ?: $localUrl;
    }

    private function resolveLocalUrl(): ?string
    {
        if (!$this->local_url) {
            return null;
        }

        if (Str::startsWith($this->local_url, ["http://", "https://"])) {
            return $this->local_url;
        }

        $path = ltrim($this->local_url, "/");

        if (Str::startsWith($path, "storage/")) {
            return url($path);
        }

        if (Str::startsWith($path, "public/")) {
            $path = Str::after($path, "public/");
        }

        if (file_exists(storage_path("app/public/" . $path))) {
            return url("storage/" . $path);
        }

        return null;
    }
}
