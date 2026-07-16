<?php

namespace App\Http\Resources\V1\Base;


use App\Models\Base\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Constants\PhaseSettingConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Models\Training\Article;
use App\Models\Training\Course;
use App\Repositories\UserRepository;

class UserProgressResource extends JsonResource
{

    protected $totalArticleCount;
    protected $userRepo;

    public function __construct($resource, $totalArticleCount)
    {
        parent::__construct($resource);
        $this->totalArticleCount = $totalArticleCount;
        $this->userRepo = new UserRepository();
    }

    public function toArray(Request $request): array
    {
        $progress = $this->userRepo->percentProgress($this->totalArticleCount, $this);
        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "last_phase" => $this->last_phase,
            "progress" => $progress,
            "last_phase_label" => PhaseSettingConstant::LIST[$this->last_phase] ?? null,
        ];
    }
}
