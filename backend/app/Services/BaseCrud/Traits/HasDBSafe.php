<?php

namespace App\Services\BaseCrud\Traits;

use Illuminate\Support\Facades\DB;

trait HasDBSafe
{
    public $thMessage;
    public $thData;

    public $dbTrxDisable = false;

    public function DBSafe($func)
    {
        if ($this->dbTrxDisable) {
            return $func();
        }

        try {
            DB::beginTransaction();

            $data = $func();

            DB::commit();
            return $data;
        } catch (\Throwable $th) {

            DB::rollBack();
            return $this->__errorDBSafe($th);
        }
    }

    public function __errorDBSafe($th)
    {
        if (!empty($this->thMessage)) {
            return $this->thMessage;
        }

        throw $th;
    }
}