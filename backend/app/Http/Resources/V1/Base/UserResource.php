<?php

namespace App\Http\Resources\V1\Base;


use App\Models\Base\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Master\CitiesResource;
use App\Constants\BloodTypeConstant;
use App\Constants\LastEducationConstant;
use App\Constants\PhaseSettingConstant;
use App\Constants\RegisterInformationConstant;
use App\Constants\Training\InterviewStatusConstant;
use App\Constants\Training\TrainingLevelConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\TrainingPreferenceConstant;
use App\Http\Resources\V1\Master\ProvinceResource;
use App\Http\Resources\V1\Training\UserCourseResource;
use App\Http\Resources\V1\Training\UserExamResource;

class UserResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "name_alias" => $this->name_alias,
            "email" => $this->email,
            "google_id" => $this->google_id,
            "facebook_id" => $this->facebook_id,
            "apple_id" => $this->apple_id,
            "phone" => $this->phone,
            "address" => $this->address,
            "birthplace" => $this->birthplace,
            "dob" => $this->dob,
            "is_active" => $this->is_active,
            "is_active_label" => User::LABEL_STATUS_STUDENT[$this->is_active] ?? null,
            "active_date" => $this->active_date,
            "blood_type" => $this->blood_type,
            "bloodtype_label" => BloodTypeConstant::LIST[$this->blood_type] ?? null,
            "last_education" => $this->last_education,
            "last_education_label" => LastEducationConstant::LIST[$this->last_education] ?? null,
            "study_program" => $this->study_program,
            "id_card" => $this->id_card,
            "training_program" => $this->training_program,
            "training_program_label" => TrainingProgramConstant::LIST[$this->training_program] ?? null,
            "is_training" => $this->is_training,
            "status_training_label" => User::LABEL_STATUS_TRAINING[$this->is_training] ?? null,
            "training_preference" => $this->training_preference,
            "training_preference_label" => TrainingPreferenceConstant::LIST[$this->training_preference] ?? null,
            "register_information" => $this->register_information,
            "info_register_label" => RegisterInformationConstant::LIST[$this->register_information] ?? null,
            "other_register_information" => $this->other_register_information,
            "created_at" => convertToTimezone($this->created_at),
            "password_updated_at" => $this->password_updated_at,
            "join_reason" => $this->join_reason,
            "join_date" => convertToTimezone($this->join_date),
            "interview_status" => $this->interview_status,
            "interview_count" => $this->interview_count,
            "last_phase" => $this->last_phase,
            "last_phase_label" => PhaseSettingConstant::LIST[$this->last_phase] ?? null,
            "last_level" => $this->last_level ?? null,
            'last_level_label' => TrainingLevelConstant::LIST[$this->last_level] ?? null,
            "interview_status_label" => InterviewStatusConstant::LIST[$this->interview_status] ?? null,
            "is_subscription_active" => $this->is_subscription_active ?? null,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "role_name" => $this->role->name ?? null,

            "city" => new CitiesResource($this->whenLoaded("city")),
            "course" => new UserCourseResource($this->whenLoaded("course")),
            "province" => new ProvinceResource($this->whenLoaded("province")),
            "role" => new RoleResource($this->whenLoaded("role")),
            "fcm_tokens" => FcmTokenResource::collection($this->whenLoaded("fcm_tokens")),
            "profilePicture" => new FileResource($this->whenLoaded("profilePicture")),
            "user_files" => UserFilesResource::collection($this->whenLoaded("userFiles")),
            "examTestBahasa" => new UserExamResource($this->whenLoaded("examTestBahasa")),
            "examTestKarakter" => new UserExamResource($this->whenLoaded("examTestKarakter")),

            // "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            // "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            // "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
        ];
    }
}
