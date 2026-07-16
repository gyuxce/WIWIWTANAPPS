<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Constants\Finance\PaymentStatusConstant;
use App\Constants\Finance\PriceTypeConstant;
use App\Constants\Finance\TransactionAdministrationStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
use App\Models\Finance\Payment;
use App\Http\Resources\V1\Finance\PaymentResource;
use App\Http\Requests\Api\V1\Finance\ApiPaymentRequest;
use App\Http\Resources\V1\Finance\PaymentMobilePivotResource;
use App\Models\Finance\Installment;
use App\Models\Finance\Transaction;
use App\Services\BaseCrud\BaseCrud;
use App\Services\CryptoService;
use App\Services\PivotPaymentService;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use stdClass;

class PaymentController extends BaseCrud {

    public $model = Payment::class;
    public $resource = PaymentResource::class;
    public $storeValidator = ApiPaymentRequest::class;
    public $updateValidator = ApiPaymentRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "id";
    public $cacheInMinute = 10;

    public static function getLatestPayment($transaction, $is_strict = true):?Payment {
        $transaction->loadMissing(['payments', 'installment']);
        if (empty($transaction)) { 
            if ($is_strict) { throw new \Exception('Transaksi tidak ditemukan'); } 
            else { return null; }
        }

        //return existing unprocessed payment
        $service = new PivotPaymentService;
        $unprocessed = $transaction->payments->sortByDesc('updated_at')->whereNotIn('status', [PaymentStatusConstant::PAID, PaymentStatusConstant::FAILED])->first();
        
        if (!empty($unprocessed)) {
            //get existing payment data from payment gateway
            $existing = $service->access('get_payment', null, ['Content-Type' => 'application/json'], ['payment_id' => $unprocessed->number_ref]);

            //payment gateway can't find the ongoing payment, voiding payment data
            if (empty($existing) || $existing['code'] != '00') {
                $unprocessed->status = PaymentStatusConstant::FAILED;
                $unprocessed->save();
                return null; 
            } else {
                $error = $service->checkPaymentStatus($existing);
                if ($is_strict && !is_bool($error)) { throw new \Exception('Terjadi kesalahan saat proses data pembayaran: ' . $error); } 
                $unprocessed->refresh();

                return $unprocessed; 
            }
        }

        //return previous paid installment, or for installment, if not payment period yet, return latest paid payment
        $paid = $transaction->payments->sortByDesc('updated_at')->where('status', PaymentStatusConstant::PAID)->first();
        if (!empty($transaction->installment)) {
            $amount = Installment::calculateNextInstallment($transaction);
        }
        if (!empty($paid) && (empty($transaction->installment) || (!empty($transaction->installment) && ($amount === 0)))) {
            return $paid;
        }

        return null;
    }
 
    public function confirm(Request $request) {
        //validate payload data
        $data = $request->validate([
            'payment_id' => ['required'],
            'card' => ['nullable'],
            'deviceInformations' => ['nullable'],
            'encrypted_data' => ['nullable']
        ]);
        $payment = Payment::where('number_ref', $data['payment_id'])->orderBy('updated_at', 'desc')->first();
        if (empty($payment)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment not found'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (in_array($payment->status, [PaymentStatusConstant::PAID, PaymentStatusConstant::FAILED])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment has concluded'
            ], Response::HTTP_BAD_REQUEST);
        }

        $payment_data = json_decode($payment->data, 1);
        $payload = [
            'card' => $data['card'],
            'deviceInformations' => $data['deviceInformations'],
            'metadata' => new stdClass(),
        ];

        //encrypt card_data
        if ($data['card']) {
            $crypto_service = new CryptoService;
            if (empty($data['encrypted_data'])) {
                $data['encrypted_data'] = $crypto_service->hybridEncrypt(json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR), $payment_data['response']['encryptionKey']);
            }
        }

        //fetch result from PG
        $service = new PivotPaymentService;
        $payload = $service->generatePaymentConfirmationData($payment, $data);
        $response = $service->access('confirm_payment', $payload, ['Content-Type' => 'application/json'], ['payment_id' => $data['payment_id']]);
        
        //updates payment data
        $payment_data['response'] = $response['data'];
        $payment->data = json_encode($payment_data);
        $payment->save();

        $result = null;
        if (!empty($payment)) {
            $result = new PaymentMobilePivotResource($payment);
        }

        return response()->json([
            'status' => 'success',
            'data' => $result
        ], Response::HTTP_OK);
    }

    public function latest(Request $request) {
        $user = Auth::user();

        //validate payload data
        $data = $request->validate([
            'price_type' => ['required', 'numeric', Rule::in([PriceTypeConstant::ADMINSTRATION, PriceTypeConstant::TRAINING])]
        ]);
        $transaction = Transaction::with(['payments', 'installment'])->where('price_type', $data['price_type'])->where('user_id', $user->id)->orderBy('updated_at', 'desc')->first();
        $payment = null;
        $result = null;

        try {
            $payment = static::getLatestPayment($transaction, false);
        } catch(\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }

        if (!empty($payment)) {
            $result = new PaymentMobilePivotResource($payment);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $result
        ], Response::HTTP_OK);
    }
}