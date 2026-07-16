<?php

namespace App\Services\BaseCrud\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

trait HasBaseTable
{
    use HasPublicRelation;

    public static function boot()
    {
        parent::boot();
        self::creating(function ($model) {
            self::__setupBaseTable($model);
        });

        self::saving(function ($model) {
            self::__setupBaseTable($model);
        });

        self::deleting(function ($model) {
            self::__setupDeleteBaseTable($model);
        });
    }


    public static function __setupBaseTable($model)
    {
        if (empty($model->uuid)) {
            $model->uuid = Str::uuid()->toString();
        }

        if (empty($model->id)) {
            $model->created_by = Auth::id();
        }

        $model->updated_by = Auth::id();
    }

    public static function __setupDeleteBaseTable($model)
    {
        $attr = $model->getAttributes();
        if (array_key_exists('deleted_by', $attr)) {
            $model->deleted_by = Auth::id();
            $model->save();
        }
    }

    public static function getId($uuid, $field = 'uuid', $operator = '=')
    {
        if (empty($uuid)) {
            return null;
        }
        return self::where($field, $operator, $uuid)->first()->id ?? null;
    }

    public static function getFirst($uuid, $field = 'uuid')
    {
        if (empty($uuid)) {
            return null;
        }
        return self::where($field, $uuid)->first() ?? null;
    }

    public static function getOrFail($uuid, $field = 'uuid')
    {
        return self::where($field, $uuid)->firstOrFail();
    }
}