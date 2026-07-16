<?php

namespace App\Repositories\Finance;

use App\Models\Finance\PaymentContent;
use App\Models\Finance\PaymentContentItem;
use App\Repositories\BaseRepository;

class PaymentContentRepository extends BaseRepository
{
    public function getDetailPaymentContentMobile($request)
    {
        $contentQuery = PaymentContent::where('price_type', $request->input('price_type'));

        if ($request->has('payment_type')) {
            $contentQuery->where('payment_type', $request->input('payment_type'));
        }

        $content = $contentQuery->first();
        
        if ($content) {
            $items = PaymentContentItem::where('payment_content_id', $content->id)->whereNull('parent_id')->get();
            foreach ($items as $item) {
                $child = PaymentContentItem::where('payment_content_id', $content->id)
                        ->where('parent_id', $item->id)                    
                        ->where('language_type', $request->input('language_type'))
                        ->first();
                $item->child = $child;
            }
            $content->items = $items;
        }

        return $content;
    }

}