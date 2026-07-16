<?php

namespace App\Services\BaseCrud\Traits;

use Illuminate\Support\Str;

trait HasUuid
{

    public static function boot()
    {
        parent::boot();
        self::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid()->toString();
            }
        });

        self::saving(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid()->toString();
            }
        });
    }
}