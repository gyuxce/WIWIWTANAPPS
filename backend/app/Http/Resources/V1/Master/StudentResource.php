<?php

namespace App\Http\Resources\V1\Master;


use App\Http\Resources\V1\Base\FileResource;
use App\Models\Base\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Master\CitiesResource;
use App\Constants\BloodTypeConstant;
use App\Constants\LastEducationConstant;
use App\Constants\PhaseSettingConstant;
use App\Constants\RegisterInformationConstant;
use App\Constants\Training\InterviewStatusConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Http\Resources\V1\Training\InterviewResource;

class StudentResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "email" => $this->email,

            "phone" => $this->phone,
            "address" => $this->address,
            "birthplace" => $this->birthplace,
            "dob" => $this->dob,
            "study_program" => $this->study_program,
            "id_card" => $this->id_card,

            "is_active" => User::LABEL_STATUS[$this->is_active] ?? null,
            "bloodtype_label" => BloodTypeConstant::LIST[$this->blood_type] ?? null,
            "last_education_label" => LastEducationConstant::LIST[$this->last_education] ?? null,
            "status_training_label" => User::LABEL_STATUS_TRAINING[$this->is_training] ?? null,
            "training_program_label" => TrainingProgramConstant::LIST[$this->training_program] ?? null,
            "info_register_label" => RegisterInformationConstant::LIST[$this->register_information] ?? null,
            "other_register_information" => $this->other_register_information,
            "created_at" => convertToTimezone($this->created_at),
            "interview_status" => $this->interview_status,
            "interview_count" => $this->interview_count,
            "interview_status_label" => InterviewStatusConstant::LIST[$this->interview_status] ?? null,
            "last_phase" => $this->last_phase,
            "last_phase_label" => PhaseSettingConstant::LIST[$this->last_phase] ?? null,
            "city" => new CitiesResource($this->whenLoaded("city")),
            "certificate" => new FileResource($this->whenLoaded("certificate")),
            "cv" => new FileResource($this->whenLoaded("cv")),
            "interviews" => InterviewResource::collection($this->whenLoaded("interviews")),

        ];
    }
}
