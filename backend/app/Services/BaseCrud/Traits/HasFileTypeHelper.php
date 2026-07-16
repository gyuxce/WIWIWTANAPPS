<?php

namespace App\Services\BaseCrud\Traits;

use App\Models\Base\User;
use App\Models\Base\UserFiles;

trait HasFileTypeHelper
{
    public function isFileExist($slug, $user)
    {
        $checkFile = UserFiles::where('user_id', $user->id)->where('slug', $slug)->first();
        return $checkFile !== null;
    }
}