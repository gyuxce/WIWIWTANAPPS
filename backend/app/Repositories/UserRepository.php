<?php

namespace App\Repositories;

use App\Constants\PhaseSettingConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\InterviewStatusConstant;
use App\Constants\Training\UserExamStatusConstant;
use App\Models\Base\User;
use App\Repositories\BaseRepository;

class UserRepository extends BaseRepository
{
    public function percentProgress($totalArticleCount, $data)
    {
        $progress = 0;
        if ($data && $data->last_phase == PhaseSettingConstant::PHASE_PRA_TEST) {
            $pratest_language = $data->userExam->where('template_id', ExamTemplateConstant::PRATEST_LANGUAGE)->first();
            $pratest_character = $data->userExam->where('template_id', ExamTemplateConstant::PRATEST_CHARACTER)->first();
            $pratest_qna = $data->userExam->where('template_id', ExamTemplateConstant::PRATEST_QNA)->first();
            $language = $pratest_language?->status == UserExamStatusConstant::LULUS ? 100 : 0;
            $character =  $pratest_character?->status == UserExamStatusConstant::LULUS ? 100 : 0;
            $qna =  $pratest_qna?->status ? 100 : 0;
            $progress = ($language + $character + $qna) / 3;
        } else if ($data && $data->last_phase == PhaseSettingConstant::PHASE_PAYMENT) {
            $payment_admin =  $data->userBatch?->transactionAdministration;
            $payment_training = $data->userBatch?->transactionTraining;
            $admin_percent = !$payment_admin ? 0 : (($payment_admin?->total_amount - $payment_admin?->total_left_amount) / $payment_admin?->total_amount) * 100;
            $training_percent =  !$payment_training ? 0 : (($payment_training?->total_amount - $payment_training?->total_left_amount) / $payment_training?->total_amount) * 100;
            $progress = ($admin_percent > 0 || $training_percent > 0) ? ($admin_percent + $training_percent) / 2 : 0;
        } else if ($data && $data->last_phase == PhaseSettingConstant::PHASE_INTERVIEW) {
            $progress = $data->interview_status ? 100 : 0;
        } else if ($data && $data->last_phase == PhaseSettingConstant::PHASE_JAPANESE_CERTIFICATION) {
            $total_certification = $data->certification_waiting + $data->certification_done;
            $progress = $total_certification > 0 ? ($data->certification_done / $total_certification) * 100 : 0;
        } else if ($data && $data->last_phase == PhaseSettingConstant::PHASE_TRAINING) {
            if ($totalArticleCount > 0) {
                $progress = ($data->total_done_article / $totalArticleCount) * 100;
            } else {
                $progress = 0;
            }
        }
        return number_format($progress, 2);
    }
}
