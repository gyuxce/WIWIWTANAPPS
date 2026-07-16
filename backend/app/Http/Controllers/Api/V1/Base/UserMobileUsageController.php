<?php

namespace App\Http\Controllers\Api\V1\Base;

use App\Models\Base\UserMobileUsage;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class UserMobileUsageController extends BaseCrud {

    public function updateUserScreentimeUsage(Request $request)
    {
        $userId = Auth::id();
        $dateNow = now()->toDateString();

        $userMobileUsage = UserMobileUsage::where('user_id', $userId)->where('date', $dateNow)->first();
        if ($userMobileUsage) {
            $userMobileUsage->screentime_usage += $request->screentime_usage;
            $userMobileUsage->save();
        } else {
            $userMobileUsage = UserMobileUsage::firstOrCreate(
                ['user_id' => $userId, 'date' => $dateNow],
                ['screentime_usage' => $request->screentime_usage]
            );
        }

        return response()->json([
            "status" => "success",
            "data" => $userMobileUsage,
        ], 200);
    }

}
