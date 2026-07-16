<?php

namespace App\Models\Finance;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentContentItem extends Model
{
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'payment_content_items';

    protected $fillable =[
        "uuid",
        "title",
        "description",
        "index",
        "payment_content_id",
        "parent_id",
        "is_header",
        "language_type",
    ];

    protected $hidden =[
    ];

    protected $casts =[
    ];

    public function paymentContent() {
        return $this->belongsTo(PaymentContent::class,"payment_content_id")->withTrashed();
    }

    public function child() {
        return $this->hasMany(PaymentContentItem::class,"parent_id")->withTrashed();
    }
}
