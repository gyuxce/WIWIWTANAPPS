<?php

namespace App\Models\Base;

use App\Services\BaseCrud\Traits\HasBaseOwner;
use App\Services\BaseCrud\Traits\HasBaseTable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserMobileUsage extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'user_mobile_usages';

    protected $fillable = [
        "uuid",
        "user_id",
        "screentime_usage",
        "date"
    ];
   
    protected $hidden = [];

    protected $casts = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
