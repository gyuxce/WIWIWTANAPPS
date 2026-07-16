<?php

namespace App\Http\Resources\V1\Finance;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentMobilePivotResource extends JsonResource {

    public function toArray(Request $request): array{
        $data = json_decode($this->data, true);
        $result = [
            "number"=> $this->number,
            "number_ref"=> $this->number_ref,
            "adapter"=> $this->adapter,
            "expired_at"=> convertToTimezone($this->expired_at),
            "currency_code"=> $this->currency_code,
            "total"=> $this->total,
            "index"=> $this->index,
            "status"=> $this->status,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at)
        ];
        if (!empty($data['request'])) {
            $result['request_currency_code'] = $data['request']['amount']['currency'];
            $result['request_amount'] = $data['request']['amount']['value'];
            $result['request_method'] = $data['request']['paymentMethod']['type'];
        }
        if (!empty($data['response'])) {
            $result['response_currency_code'] = $data['response']['amount']['currency'];
            $result['response_amount'] = $data['response']['amount']['value'];
            $result['response_method'] = $data['response']['paymentMethod']['type'];
            $result['response_status'] = $data['response']['status'];
            $result['response_key'] = $data['response']['encryptionKey'] ?? null;
            $result['response_url'] = $data['response']['paymentUrl'] ?? null;

            if (!empty($data['response']['redirectUrl'])) {
                $result['response_redirect_success'] = $data['response']['redirectUrl']['successReturnUrl'];
                $result['response_redirect_expired'] = $data['response']['redirectUrl']['failureReturnUrl'];
                $result['response_redirect_failed'] = $data['response']['redirectUrl']['expirationReturnUrl'];
            }

            if (!empty($data['response']['chargeDetails']) && !empty($data['response']['chargeDetails'][0])) {
                $result['charge_currency_code'] = $data['response']['chargeDetails'][0]['amount']['currency'];
                $result['charge_amount'] = $data['response']['chargeDetails'][0]['amount']['value'];
                $result['charge_status'] = $data['response']['chargeDetails'][0]['status'];
                $result['charge_paid_at'] = $data['response']['chargeDetails'][0]['paidAt'];
                
                //QR
                if (!empty($data['response']['chargeDetails'][0]['qr'])) {
                    $result['qr_content'] = $data['response']['chargeDetails'][0]['qr']['qrContent'];
                    $result['qr_url'] = $data['response']['chargeDetails'][0]['qr']['qrUrl'];
                    $result['qr_expired_at'] = $data['response']['chargeDetails'][0]['qr']['expiryAt'];
                    $result['qr_name'] = $data['response']['chargeDetails'][0]['qr']['merchantName'];
                }

                //VA
                if (!empty($data['response']['chargeDetails'][0]['virtualAccount'])) {
                    $result['va_channel'] = $data['response']['chargeDetails'][0]['virtualAccount']['channel'];
                    $result['va_number'] = $data['response']['chargeDetails'][0]['virtualAccount']['virtualAccountNumber'];
                    $result['va_expired_at'] = $data['response']['chargeDetails'][0]['virtualAccount']['expiryAt'];
                    $result['va_name'] = $data['response']['chargeDetails'][0]['virtualAccount']['virtualAccountName'];
                }

                //CC
                if (!empty($data['response']['chargeDetails'][0]['card'])) {
                    $result['card_type'] = $data['response']['chargeDetails'][0]['card']['binInformations']['type'];
                    $result['card_brand'] = $data['response']['chargeDetails'][0]['card']['binInformations']['brand'];
                }

                //EWALLET
                //todo

                //payment simulation link
                if (!empty($data['response']['metadata']) && !config('pivot-payment.is_production')) {
                    $result['simulation'] = $data['response']['metadata']['paymentSimulator'] ?? null;
                }
            }
        }

        return $result;
    }

}