<?php

namespace App\Models\Finance;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentContent extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'payment_contents';

    protected $fillable =[
        "uuid",
        "title",
        "description",
        "total_content",
        "price_type",
        "payment_type",
    ];

    protected $hidden =[
    ];

    protected $casts =[
    ];

    public function items()
    {
        return $this->hasMany(PaymentContentItem::class, "payment_content_id")
                ->where('language_type', null);
        ;
    }
}
