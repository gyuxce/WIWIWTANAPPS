<?php

namespace App\Http\Controllers\Api\V1\Base;

use App\Constants\CertificationStatusConstant;
use App\Constants\CertificationStudentStatusConstant;
use App\Http\Controllers\Controller;
use App\Constants\BloodTypeConstant;
use App\Constants\LastEducationConstant;
use App\Constants\RegisterInformationConstant;
use App\Constants\SeminarStatusConstant;
use App\Constants\ContentNotificationRepeatConstant;
use App\Constants\ContentNotificationStatusConstant;
use App\Constants\ContentNotificationTargetConstant;
use App\Constants\Forum\ForumTopicTypeConstant;
use App\Constants\Forum\ForumReportTypeConstant;
use App\Constants\Forum\ForumReportStatusConstant;
use App\Constants\Training\TrainingAccessModuleConstant;
use App\Constants\Training\TrainingLevelConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\TrainingPreferenceConstant;
use App\Constants\Training\CourseItemGroupConstant;
use App\Constants\Training\CourseTypeConstant;
use App\Constants\Finance\PriceTypeConstant;
use App\Constants\Finance\TransactionAdministrationStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
use App\Constants\Finance\BatchUserStatusConstant;
use App\Constants\Finance\InstallmentPeriodTypeConstant;
use App\Constants\Finance\PaymentProofStatusConstant;
use App\Constants\Finance\PaymentStatusConstant;
use App\Constants\Finance\PaymentTypeConstant;
use App\Constants\LanguageSettingConstant;
use App\Constants\PhaseSettingConstant;
use App\Constants\Training\ArticleTypeConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\InterviewTypeConstant;
use App\Constants\Training\QuestionsConstant;
use App\Constants\Training\UserArticleStatusConstant;
use App\Constants\Training\UserCourseItemScheduleStatus;
use App\Constants\Training\UserCourseItemStatusConstant;
use App\Constants\Training\UserExamStatusConstant;
use App\Constants\UserFilesConstant;
use App\Constants\UserFilesSlug;
use Illuminate\Http\Request;

class ConstantController extends Controller
{
    public function getConstants(Request $request)
    {
        $constantList = [];
        switch ($request['data']) {
            case 'blood_type':
                $data = BloodTypeConstant::LIST;
                break;
            case 'last_education':
                $data = LastEducationConstant::LIST;
                break;
            case 'register_information':
                $data = RegisterInformationConstant::LIST;
                break;
            case 'training_program':
                $data = TrainingProgramConstant::LIST;
                break;
            case 'training_preference':
                $data = TrainingPreferenceConstant::LIST;
                break;
            case 'forum_topic_type':
                $data = ForumTopicTypeConstant::LIST;
                break;
            case 'forum_report_type':
                $data = ForumReportTypeConstant::LIST;
                break;
            case 'forum_report_status':
                $data = ForumReportStatusConstant::LIST;
                break;
            case 'seminar_status':
                $data = SeminarStatusConstant::LIST;
                break;
            case 'content_notif_status':
                $data = ContentNotificationStatusConstant::LIST;
                break;
            case 'content_notif_repeat':
                $data = ContentNotificationRepeatConstant::LIST;
                break;
            case 'certification_status':
                $data = CertificationStatusConstant::LIST;
                break;
            case 'certification_student_status':
                $data = CertificationStudentStatusConstant::LIST;
                break;
            case 'course_type':
                $data = CourseTypeConstant::LIST;
                break;
            case 'question_type':
                $data = QuestionsConstant::LIST;
                break;
            case 'training_level':
                $data = TrainingLevelConstant::LIST;
                break;
            case 'training_access_module':
                $data = TrainingAccessModuleConstant::LIST;
                break;
            case 'course_item_group':
                $data = CourseItemGroupConstant::LIST;
                break;
            case 'transaction_administration_status':
                $data = TransactionAdministrationStatusConstant::LIST;
                break;
            case 'transaction_training_status':
                $data = TransactionTrainingStatusConstant::LIST;
                break;
            case 'batch_user_status':
                $data = BatchUserStatusConstant::LIST;
                break;
            case 'installment_period_type':
                $data = InstallmentPeriodTypeConstant::LIST;
                break;
            case 'payment_proof_status':
                $data = PaymentProofStatusConstant::LIST;
                break;
            case 'payment_status':
                $data = PaymentStatusConstant::LIST;
                break;
            case 'language':
                $data = LanguageSettingConstant::LIST;
                break;
            case 'phase':
                $data = PhaseSettingConstant::LIST;
                break;
            case 'payment_type':
                $data = PaymentTypeConstant::LIST;
                break;
            case 'price_type':
                $data = PriceTypeConstant::LIST;
                break;
            case 'user_files_constant':
                $data = UserFilesConstant::LIST;
                break;
            case 'user_files_slug':
                $data = UserFilesSlug::LIST;
                break;
            case 'interview_type':
                $data = InterviewTypeConstant::LIST;
                break;
            case 'article_type':
                $data = ArticleTypeConstant::LIST;
                break;
            case 'user_article_status':
                $data = UserArticleStatusConstant::LIST;
                break;
            case 'exam_template':
                $data = ExamTemplateConstant::LIST;
                break;
            case 'user_course_item_status':
                $data = UserCourseItemStatusConstant::LIST;
                break;
            case 'status_pratest':
                $data = UserExamStatusConstant::LIST;
                break;
            case 'content_notification_target':
                $data = ContentNotificationTargetConstant::LIST;
                break;
            case 'status_scheduled_assesment_verbal':
                $data = UserCourseItemScheduleStatus::LIST;
                break;
            default:
                $data = BloodTypeConstant::LIST;
                break;
        }
        foreach ($data as $value => $label) {
            $constantList[] = [
                'value' => $value,
                'name' => $label,
            ];
        }

        return response()->json($constantList);
    }
}
