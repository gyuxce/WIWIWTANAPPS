<?php

namespace App\Repositories\Finance;

use App\Models\Finance\PaymentAdapter;
use App\Models\Finance\PaymentDetail;
use App\Repositories\BaseRepository;

class PaymentDetailRepository extends BaseRepository
{
    public function createPaymentDetail($dataPayment, $dataRequest, $dataCallback)
    {
        $paymentAdapter = PaymentAdapter::where('code', 'xendit')->first();
        $dtoPaymentDetail = [
            "payment_id" => $dataPayment->id,
            "adapter_id" => $paymentAdapter->id,
            "number" => $dataCallback['id'],
            "checkout_url" => $dataCallback['invoice_url'],
            "expired_at" => $dataCallback['expiry_date'],
            "data_request" => $dataRequest,
            "data_callback" => $dataCallback,
        ];
        $createPaymentDetail = PaymentDetail::create($dtoPaymentDetail);
        return $createPaymentDetail;
    }

}