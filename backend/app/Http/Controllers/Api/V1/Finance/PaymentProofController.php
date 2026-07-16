<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Constants\Finance\PaymentProofStatusConstant;
use App\Constants\Finance\PriceTypeConstant;
use App\Constants\Finance\TransactionAdministrationStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
use App\Constants\PhaseSettingConstant;
use App\Models\Finance\PaymentProof;
use App\Models\Finance\Transaction;
use App\Models\Finance\Installment;
use App\Models\Base\File;
use App\Http\Resources\V1\Finance\PaymentProofResource;
use App\Http\Requests\Api\V1\Finance\ApiPaymentProofRequest;
use App\Http\Requests\Api\V1\Finance\ApiPaymentProofUpdateStatusRequest;
use App\Models\Finance\Payment;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\V1\Sailfish\HasNotifications;
use App\Models\Base\User;
use App\Models\Finance\BatchUser;
use App\Repositories\Finance\BatchUserRepository;
use App\Services\BaseCrud\Traits\HasLogHelper;

class PaymentProofController extends BaseCrud
{

    use HasNotifications, HasLogHelper;
    public $model = PaymentProof::class;
    public $resource = PaymentProofResource::class;
    public $storeValidator = ApiPaymentProofRequest::class;
    public $updateValidator = ApiPaymentProofRequest::class;
    public $updateStatusApprovalValidator = ApiPaymentProofUpdateStatusRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public $batchUserRepo;

    public function __construct()
    {
        $this->batchUserRepo = new BatchUserRepository();
    }

    public function __prepareDataStore($data)
    {
        $payment = Payment::with('transaction')->where('uuid', $data['payment_id'])->first();

        // validation if the left amount of installment is paid off
        if ($payment->transaction->total_left_amount <= 0) {
            abort(404, "Pembayaran cicilan telah lunas");
        }

        // validation if the previous payment has not been approved
        if ($payment->index > 1) {
            $prevPayment = Payment::where('transaction_id', $payment->transaction_id)->where('index', $payment->index - 1)->with('paymentProof')->first();
            if ($prevPayment->paymentProof->status != PaymentProofStatusConstant::APPROVED) {
                abort(404, "Upload pembayaran cicilan " . $payment->index . " tidak dapat diproses");
            }
        }

        $data["payment_id"] = Payment::getId($data['payment_id']);
        $data["installment_id"] = Installment::getId($data['installment_id']);
        $data["transaction_id"] = Transaction::getId($data['transaction_id']);
        $data["file_id"] = File::getId($data['file_id']);
        $data["user_id"] = Auth::id();
        $data["date"] = now();
        $data["status"] = PaymentProofStatusConstant::SUBMITTED;
        $data["currency_code"] = "IDR";
        $data["amount"] = $payment->total;

        return $data;
    }

    public function __prepareDataUpdate($data)
    {
        $data = $this->__prepareDataStore($data);
        unset($data['created_by']);
        return $data;
    }

    public function __afterStore()
    {
        // update data payment
        $currentPayment = Payment::getFirst($this->row->payment_id, 'id');
        $currentPayment->update([
            'installment_id' => $this->row->installment_id
        ]);

        // update data installment
        $installment = Installment::getFirst($this->row->installment_id, 'id');

        if ($installment->index == 1) {
            $dtoUpdateInstallment = [
                'payment_first_at' => now(),
            ];
            $installment->update($dtoUpdateInstallment);
        }

        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->user->name];
        $this->__insertLog($dataLog, "created", null);
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->user->name];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function updateStatusApproval($id)
    {
        $req = app($this->updateStatusApprovalValidator);
        $totalInstallment = config('pivot-payment.installment_total');

        $paymentProof = PaymentProof::with('user', 'payment')->where('uuid', $id)->first();
        $currentIndex = $paymentProof->payment->index;
        $remainingIndex = $totalInstallment - $currentIndex;

        if ($paymentProof->status == PaymentProofStatusConstant::APPROVED) {
            abort(404, "Pembayaran cicilan ini telah disetujui");
        }

        $transaction = Transaction::where('id', $paymentProof->transaction_id)->first();
        # update total left amount in transaction & each payments if status approved
        if ($req->input('status') == PaymentProofStatusConstant::APPROVED) {
            $prevLeftAmount = $transaction->total_left_amount;

            if ($prevLeftAmount > 0) {
                $totalAmountApproved = $req->input('total_amount_approved');
                if ($totalAmountApproved > $prevLeftAmount) {
                    $totalAmountApproved = $prevLeftAmount;
                }

                $payments = Payment::where('transaction_id', $transaction->id)->get();
                $totalLeftAmount = $prevLeftAmount - $totalAmountApproved;

                $transaction->update([
                    'total_left_amount' => $totalLeftAmount
                ]);

                $eachLeftAmount = 0;
                if ($totalLeftAmount > 0) {
                    $eachLeftAmount = $totalLeftAmount / $remainingIndex;
                } else {
                    // update status transaction if all installment is paid
                    $this->batchUserRepo->updateBatchUserTransaction($transaction);
                }

                foreach ($payments as $payment) {
                    if ($payment->index == $paymentProof->payment->index) {
                        $payment->update([
                            'total' => $totalAmountApproved
                        ]);
                    } else if ($payment->index > $paymentProof->payment->index) {
                        $payment->update([
                            'total' => $eachLeftAmount
                        ]);
                    }
                }

                $paymentProof->update([
                    'status' => $req->input('status'),
                    'amount' => $totalAmountApproved,
                ]);
            } else {
                abort(404, "Pembayaran telah lunas");
            }

            // update installment of the current payment
            $currentPayment = Payment::getFirst($paymentProof->payment_id, 'id');
            $currentPayment->update([
                'installment_id' => $paymentProof->installment_id
            ]);

            // update data installment
            $installment = Installment::getFirst($paymentProof->installment_id, 'id');
            $paymentNext = Payment::where('index', $currentPayment->index + 1)->where('transaction_id', $paymentProof->transaction_id)->first();

            $dtoUpdateInstallment = [
                'payment_next_id' => $paymentNext->id,
                'payment_last_id' => $currentPayment->id,
                'payment_last_at' => now(),
                'index' => $currentPayment->index + 1
            ];

            if ($installment->index == 1) {
                $dtoUpdateInstallment['payment_first_at'] = now();

                $this->updateBatchUserTransactionInstallment($transaction);
            }

            $installment->update($dtoUpdateInstallment);
        }

        # update user's last phase
        $batchUser = BatchUser::where('user_id', $paymentProof->user_id)->first();
        setLastPhasePayment($batchUser);

        # send notification if status declined
        if ($req->input('status') == PaymentProofStatusConstant::DENIED) {
            $priceType = "Administrasi";
            if ($transaction->price_type == PriceTypeConstant::TRAINING) {
                $priceType = "Training";
            }
            $notifdata = ["title" => "Pembayaran Cicilan", "body" => "Pembayaran cicilan [" . $priceType . "] ke [" . $paymentProof->payment->index . "] anda ditolak oleh [" . Auth::user()->name . "]", "data" => ["module" => "payment-proof", "proof_id" => $paymentProof->uuid]];
            $this->__pushNotification($paymentProof->user, $notifdata);

            $paymentProof->update([
                'status' => $req->input('status'),
            ]);

            $paymentProof->delete();
        } else if ($req->input('status') == PaymentProofStatusConstant::APPROVED) {
            $priceType = "Administrasi";
            if ($transaction->price_type == PriceTypeConstant::TRAINING) {
                $priceType = "Training";
            }
            $notifdata = ["title" => "Pembayaran Cicilan", "body" => "Pembayaran cicilan [" . $priceType . "] ke [" . $paymentProof->payment->index . "] anda berhasil disetujui oleh [" . Auth::user()->name . "]", "data" => ["module" => "payment-proof", "proof_id" => $paymentProof->uuid]];
            $this->__pushNotification($paymentProof->user, $notifdata);

            $paymentProof->update([
                'status' => $req->input('status'),
            ]);
        }

        return response()->json([
            "status" => "success",
            "message" => __('messages.success_update_status_payment_proof'),
        ], 200);
    }

    protected function updateBatchUserTransactionInstallment($transaction)
    {
        $dtoBatchUser = [
            'updated_at' => now(),
            'updated_by' => Auth::id(),
        ];
        switch ($transaction->price_type) {
            case PriceTypeConstant::ADMINSTRATION:
                $dtoBatchUser["transaction_status"] = TransactionAdministrationStatusConstant::INSTALLMENT;
                break;

            case PriceTypeConstant::TRAINING:
                $dtoBatchUser["transaction2_status"] = TransactionTrainingStatusConstant::INSTALLMENT;
                break;
        }

        $query = BatchUser::where('user_id', $transaction->user_id)->first();

        if ($query && !empty($dtoBatchUser)) {
            $query->update($dtoBatchUser);
        }

        return $query;
    }
}
