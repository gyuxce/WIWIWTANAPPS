<?php

namespace App\Repositories;

use App\Constants\PhaseSettingConstant;
use App\Constants\Training\InterviewStatusConstant;
use App\Models\Base\User;
use App\Models\Base\UserMobileUsage;
use App\Repositories\BaseRepository;
use App\Models\Master\Certification;
use DateTime;

class DashboardRepository extends BaseRepository
{
    public function interview()
    {
        $interviewData = User::selectRaw('COUNT(*) as total')
            ->selectRaw('(SUM(CASE WHEN interview_status != ? THEN 1 ELSE 0 END) / COUNT(*)) * 100 as percent', [InterviewStatusConstant::WAITING])
            ->whereNotNull('interview_status')
            ->first();
        return number_format($interviewData->percent, 2);
    }

    public function certification()
    {
        $certificationData = Certification::selectRaw('COUNT(*) as total')
            ->selectRaw('(SUM(CASE WHEN status IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*)) * 100 as percent')
            ->first();
        return number_format($certificationData->percent, 2);
    }

    public function pratest()
    {
        $pratestData = User::selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN last_phase > ? THEN 1 ELSE 0 END) as done', [PhaseSettingConstant::PHASE_PRA_TEST])
            ->selectRaw('(SUM(CASE WHEN last_phase > ? THEN 1 ELSE 0 END) / COUNT(*)) * 100 as percent', [PhaseSettingConstant::PHASE_PRA_TEST])
            ->first();

        return number_format($pratestData->percent, 2);
    }

    public function training()
    {
        $pratestData = User::selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN last_phase > ? THEN 1 ELSE 0 END) as done', [PhaseSettingConstant::PHASE_TRAINING])
            ->selectRaw('(SUM(CASE WHEN last_phase > ? THEN 1 ELSE 0 END) / COUNT(*)) * 100 as percent', [PhaseSettingConstant::PHASE_TRAINING])
            ->first();

        return number_format($pratestData->percent, 2);
    }

    public function payment()
    {
        $total_records = User::join('batch_users', 'users.id', '=', 'batch_users.user_id')
            ->join('transactions', 'batch_users.transaction_id', '=', 'transactions.id')
            ->leftJoin('transactions as t2', 'batch_users.transaction2_id', '=', 't2.id')
            ->select('users.*', 'transactions.total_amount', 't2.total_left_amount')
            ->where('t2.total_left_amount', '=', 0)
            ->havingRaw('COUNT(batch_users.user_id) > 0')
            ->groupBy('users.id')
            ->count();

        $total_users = User::whereNull('role_id')->count();
        $percent_zero_left_amount = ($total_users > 0) ? ($total_records / $total_users) * 100 : 0;
        return number_format($percent_zero_left_amount, 2);
    }

    public function totalStudent()
    {
        $data = User::whereNull('role_id')->count();
        return $data;
    }

    public function averageUserScreentime()
    {
        $datas = UserMobileUsage::selectRaw('date, SUM(screentime_usage) as total_screentime_usage, COUNT(id) as total_data, AVG(screentime_usage) as average_screentime_usage')
            ->orderBy('date', 'asc')
            ->groupBy('date')
            ->get();

        if (count($datas) > 0) {
            $totalAvarageFromEachDay = 0;
            foreach ($datas as $data) {
                $totalAvarageFromEachDay += $data->average_screentime_usage;
            }

            $firstDate = new DateTime($datas[0]->date);
            $now = new DateTime('now');
            $interval = $firstDate->diff($now);
            $numberOfDays = $interval->days + 1;
            $totalAverageSeconds = $totalAvarageFromEachDay / $numberOfDays;

            // Convert seconds to hours and minutes
            $hours = floor($totalAverageSeconds / 3600);
            $minutes = floor(($totalAverageSeconds % 3600) / 60);
            if ($hours > 0) {
                $response = $hours . ' hours ' . $minutes . ' minutes';
            } else {
                $response = $minutes . ' minutes';
            }
        } else {
            $response = '0 hours 0 minutes';
        }

        return $response;
    }
}
