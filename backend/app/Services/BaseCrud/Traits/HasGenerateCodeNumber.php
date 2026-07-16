<?php

namespace App\Services\BaseCrud\Traits;

use Carbon\Carbon;

trait HasGenerateCodeNumber
{

    public function __generateNumber($id, $init = 'CODE', $length = 7)
    {
        return $init . '-' . Carbon::now()->format('Ymd') . sprintf("%0" . $length . "d", $id);
    }
}