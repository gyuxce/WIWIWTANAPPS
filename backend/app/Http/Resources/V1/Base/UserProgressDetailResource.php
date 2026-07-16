<?php

namespace App\Http\Resources\V1\Base;


use App\Models\Base\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Master\CitiesResource;
use App\Constants\BloodTypeConstant;
use App\Constants\LastEducationConstant;
use App\Constants\RegisterInformationConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\InterviewStatusConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\TrainingPreferenceConstant;
use App\Http\Resources\V1\Master\CertificationStudentResource;
use App\Http\Resources\V1\Master\ProvinceResource;
use App\Http\Resources\V1\Training\CourseMobileResource;
use App\Http\Resources\V1\Training\UserCourseResource;
use App\Http\Resources\V1\Training\UserExamResource;
use App\Models\Finance\Transaction;

class UserProgressDetailResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $pratest_language = $this->pratestLanguage;

        $pratest_character = $this->pratestCharacter;

        $pratest_qna = $this->pratestQna;
        $pratest = [
            'test_language' => $pratest_language && $pratest_language->status ? 100 : 0,
            'test_character' => $pratest_character && $pratest_character->status ? 100 : 0,
            'test_qna' => $pratest_qna && $pratest_qna->status ? 100 : 0,
        ];

        $transaction = [];
        if ($this->whenLoaded('userBatch')) {
            $payment_admin = $this->userBatch?->transactionAdministration;
            $payment_training = $this->userBatch?->transactionTraining;
            $transaction = [
                'payment_admin' => !$payment_admin ? 0 : number_format((($payment_admin?->total_amount - $payment_admin?->total_left_amount) / $payment_admin?->total_amount) * 100, 2),
                'payment_training' => !$payment_training ? 0 : number_format((($payment_training?->total_amount - $payment_training?->total_left_amount) / $payment_training?->total_amount) * 100, 2),
            ];
        }

        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "name_alias" => $this->name_alias,
            "pratest" => $pratest,
            "transaction" => $transaction,
            "certifications" => CertificationStudentResource::collection($this->whenLoaded("certifications")),
            "courses" =>  CourseMobileResource::collection($this->courses),
            "interview_status" => $this->interview_status,
            "interview_status_label" => InterviewStatusConstant::LIST[$this->interview_status] ?? null,
            "interview_percent" => $this->interview_status ? 100 : 0,
        ];
    }
}
