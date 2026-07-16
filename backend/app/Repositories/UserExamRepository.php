<?php

namespace App\Repositories;

use App\Repositories\BaseRepository;
use App\Models\Forum\ForumPost;
use App\Models\Training\ExamSchedule;
use App\Models\Training\UserExam;
use App\Models\Training\UserExamQuestion;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserExamRepository extends BaseRepository
{
    public function filterStatusPratest($filter)
    {
        // untuk security
        $allowedValues = [0, 1, 2];
        $filteredValues = array_intersect($filter, $allowedValues);

        $query = UserExam::select('user_exams.*', DB::raw('IF(exam_test_bahasa.id IS NOT NULL AND exam_test_karakter.id IS NOT NULL, 2, IF(exam_test_bahasa.id IS NOT NULL, 1, 0)) AS status_pr'))
        ->leftjoin('user_exams as exam_test_bahasa', function ($join) {
            $join->on('user_exams.user_id', '=', 'exam_test_bahasa.user_id')
                ->where('exam_test_bahasa.template_id', '=', 2)
                ->where('exam_test_bahasa.status', '=', 1);
        })
        ->leftjoin('user_exams as exam_test_karakter', function ($join) {
            $join->on('user_exams.user_id', '=', 'exam_test_karakter.user_id')
                ->where('exam_test_karakter.template_id', '=', 4)
                ->where('exam_test_karakter.status', '=', 1);
        })
        ->where(function($q) use($filteredValues) {
            if (count($filteredValues) > 0) {
               $q->whereIn(DB::raw('IF(exam_test_bahasa.id IS NOT NULL AND exam_test_karakter.id IS NOT NULL, 2, IF(exam_test_bahasa.id IS NOT NULL, 1, 0))'), $filteredValues);
            }
        });
        return $query;
    }

    public function calculateResult($id)
    {
        $total = UserExamQuestion::where('user_exam_id', $id)->sum('o_weight_true');
        $achieved = UserExamQuestion::where('user_exam_id', $id)->sum('a_weight');

        $exam = UserExam::findOrFail($id);
        $exam->weight_total = $total;
        $exam->weight_achieved = $achieved;
        $exam->save();

        return $exam;
    }

    public function calculateExamResult($result, $total = 0)
    {
        $val = ($total > 0) ? ($result / $total) * 100 : 0;
        return number_format($val, 2);
    }
}
