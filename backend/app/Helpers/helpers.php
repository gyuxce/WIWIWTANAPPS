<?php

use App\Constants\PhaseSettingConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\UserCourseItemStatusConstant;
use App\Models\Base\User;
use App\Models\Finance\Transaction;
use App\Models\Training\CourseItem;
use App\Models\Training\UserCourseItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

if (!function_exists('convertToTimezone')) {
    function convertToTimezone($datetime, $format = 'Y-m-d H:i:s') {
        $timezone = env('APP_TIMEZONE', 'UTC'); // Default to UTC if not set

        if (is_null($datetime)) {
            return null;
        }

        return Carbon::parse($datetime)->timezone($timezone)->format($format);
    }
}

if (!function_exists('setUserTrainingLevel')) {
    function setUserTrainingLevel($userId) {
        $user = User::where('id', $userId)->first();

        $currentLevel = $user->last_level;
        $countLevelReference = countLevelReference($currentLevel, $user->training_program);
        $currentCountLevelReference = 0;

        // get module of program type (SSW/TITP)
        $courseItems = CourseItem::where('program_type', $user->training_program)
                        ->where('level_module', $currentLevel)
                        ->whereIn('exam_template_id', [
                            ExamTemplateConstant::ASSESMENT_QUESTION, 
                            ExamTemplateConstant::ASSESMENT_CONVERSATION
                        ])
                        ->orderBy('parent_id', 'asc')
                        ->get();

        if ($courseItems) {
            $courseItemIds = $courseItems->pluck('id')->toArray();

            // check data user_course_items is exist or not
            $userCourseItems = UserCourseItem::whereIn('item_id', $courseItemIds)
                                ->where('user_id', $user->id)
                                ->where('status', 1)
                                ->get();

            if ($userCourseItems) {
                foreach ($courseItems as $courseItem) {
                    $userCourseItem = UserCourseItem::where('item_id', $courseItem->id)
                                        ->where('user_id', $user->id)
                                        ->where('status', 1)
                                        ->first();

                    if ($userCourseItem) {
                        if ($userCourseItem->status == UserCourseItemStatusConstant::FINISHED) {
                            $currentCountLevelReference += 1;
                        }
                    }
                }

                if ($currentCountLevelReference == $countLevelReference) {
                    if ($currentLevel > 1) {
                        $currentLevel -= 1;
                        $user->update([
                            'last_level' => $currentLevel
                        ]);
                    }
                } else {
                    return false;
                }
            }
        }

        return true;
    }

    function countLevelReference($level, $trainingProgram) {
        $countLevelReference = CourseItem::where('program_type', $trainingProgram)
                        ->where('level_module', $level)
                        ->whereIn('exam_template_id', [
                            ExamTemplateConstant::ASSESMENT_QUESTION, 
                            ExamTemplateConstant::ASSESMENT_CONVERSATION
                        ])
                        ->count();

        return $countLevelReference;
    }
}

if (!function_exists('bulkUpdateById')) {
    /**
     * @param [type] $table : string, table name
     * @param [type] $data : array, each records must consist of id and every columns defined in $columns
     * @param [type] $columns : array, list of columns involved in the update
     */
    function bulkUpdateById(string $table, array $data, array $columns): void
    {
        if (empty($data)) return;

        $ids = array_column($data, 'id');
        $cases = [];

        foreach ($columns as $column) {
            $case = "`$column` = CASE `id`";
            foreach ($data as $row) {
                $rawValue = $row[$column] ?? null;

                // Convert empty string or null to SQL NULL
                if ($rawValue === '' || $rawValue === null) {
                    $value = 'NULL';
                } elseif (is_numeric($rawValue)) {
                    $value = $rawValue;
                } else {
                    $value = DB::getPdo()->quote($rawValue); // safely quote strings
                }

                $case .= " WHEN {$row['id']} THEN $value";
            }
            $case .= ' END';
            $cases[] = $case;
        }

        $casesSql = implode(",\n", $cases);
        $idsSql = implode(', ', array_map('intval', $ids));

        DB::statement("UPDATE `$table` SET \n$casesSql\nWHERE `id` IN ($idsSql)");
    }
}

if (!function_exists('setLastPhasePayment')) {
    /**
     * @param [type] $data : batch_users data
     */
    function setLastPhasePayment($data) {
        $administrationPaymentCheck = false;
        $trainingPaymentCheck = false;

        if ($data->transaction_id != null) {
            $administrationPaymentCheck = checkPayment($data->transaction_id);
        }

        if ($data->transaction2_id != null) {
            $trainingPaymentCheck = checkPayment($data->transaction2_id);
        }

        if ($administrationPaymentCheck == true && $trainingPaymentCheck == true) {
            $user = User::where('id', $data->user_id)->first();
            $user->update([
                'last_phase' => PhaseSettingConstant::PHASE_TRAINING,
                'join_date' => now(),
            ]);
        }

        return true;
    }

    function checkPayment($transactionId) {
        if (is_null($transactionId)) {
            return false;
        }
    
        $transaction = Transaction::where('id', $transactionId)->with('installment')->first();
    
        // If transaction or installment details are not found, return false.
        if (!$transaction) {
            return false;
        }
        
        if ($transaction->installment) {
            if ($transaction->installment->payment_first_at != null) {
                return true;
            }
        } else {
            if ($transaction->total_left_amount == 0) {
                return true;
            }
        }

        return false;
    }
}

