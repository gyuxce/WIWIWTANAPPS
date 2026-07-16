<?php

namespace App\Repositories\Finance;

use App\Constants\Finance\PaymentProofStatusConstant;
use App\Constants\Finance\PaymentStatusConstant;
use App\Constants\Finance\PaymentTypeConstant;
use App\Constants\Finance\PriceTypeConstant;
use App\Constants\Finance\TransactionAdministrationStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
use App\Constants\Finance\XenditCallbackStatusConstant;
use App\Constants\PhaseSettingConstant;
use App\Models\Base\User;
use App\Models\Finance\BatchUser;
use App\Models\Finance\Installment;
use App\Models\Finance\Payment;
use App\Models\Finance\PaymentAdapter;
use App\Models\Finance\PaymentDetail;
use App\Models\Finance\PaymentProof;
use App\Models\Finance\Price;
use App\Models\Finance\Transaction;
use App\Repositories\BaseRepository;
use App\Services\XenditService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentRepository extends BaseRepository
{
    public $batchUserRepo, $paymentDetailRepo;

    public function __construct()
    {
        $this->batchUserRepo = new BatchUserRepository();
        $this->paymentDetailRepo = new PaymentDetailRepository();
    }

    public function createPaymentOfInstallment($transaction, $recurringPlan, $total_recurrence)
    {
        $totalInstallment = config('pivot-payment.installment_total');
        $countPayment = $total_recurrence ?? $totalInstallment;
        $totalPayment = $transaction->total_amount / $countPayment;

        for ($i = 1; $i <= $countPayment; $i++) {
            $dtoPayment = [
                "transaction_id" => $transaction->id,
                "total" => $totalPayment,
                "index" => $i,
            ];
            $payment = Payment::create($dtoPayment);
            if($i == 1 && !empty($recurringPlan)) {
                $paymentAdapter = PaymentAdapter::where('code', 'xendit')->first();
                $dtoPaymentDetail = [
                    "payment_id" => $payment->id,
                    "adapter_id" => $paymentAdapter->id,
                    "number" => $recurringPlan['id'],
                    "checkout_url" => $recurringPlan['actions'][0]['url'],
                    "expired_at" => null,
                    "data_request" => null,
                    "data_callback" => $recurringPlan,
                ];
                PaymentDetail::create($dtoPaymentDetail);
            }
        }
        $payments = Payment::where('transaction_id', $transaction->id)->get();
        return $payments;
    }

    // Full payment with Xendit
    public function createPaymentOfFullPayment($transaction, $priceType, $user)
    {
        $dtoPayment = [
            "transaction_id" => $transaction->id,
            "total" => $transaction->total_amount,
            "currency_code" => "IDR",
            "index" => 1,
        ];
        $createPayment = Payment::create($dtoPayment);

        # xendit process
        $params = [
            "id" => $createPayment->uuid,
            "description" => "Pembayaran " . PriceTypeConstant::LIST[$priceType] . " " . $user->name,
            "amount" => $createPayment->total,
            "currency_code" => $createPayment->currency_code,
        ];
        $xenditService = new XenditService();
        $paymentTransaction = $xenditService->createInvoice($params);
        
        # update batch users
        $dtoBatchUser = [
            'updated_at' => now(),
            'updated_by' => Auth::id(),
        ];
        switch ($priceType) {
            case PriceTypeConstant::ADMINSTRATION:
                $dtoBatchUser["transaction_status"] = TransactionAdministrationStatusConstant::UNPAID;
                break;

            case PriceTypeConstant::TRAINING:
                $dtoBatchUser["transaction2_status"] = TransactionTrainingStatusConstant::UNPAID;
                break;
        }
        $query = BatchUser::where('user_id', $transaction->user_id)->first();
        if ($query && !empty($dtoBatchUser)) {
            $query->update($dtoBatchUser);
        }
        
        # create payment detail
        $paymentDetail = $this->paymentDetailRepo->createPaymentDetail($createPayment, $params, $paymentTransaction);
        
        return $paymentDetail;
    }

    public function getDetailPaymentOfInstallment($request)
    {
        $data = [];
        $paymentsData = [];
        $totalAmount = 0;
        $leftAmount = 0;

        $user = User::getFirst(Auth::id(), 'id');
        if ($user->training_program) {
            if ($request->input('payment_type') == PaymentTypeConstant::INSTALLMENT) {
                $paymentsData = DB::table('payments')
                    ->join('transaction_items', 'transaction_items.transaction_id', '=', 'payments.transaction_id')
                    ->join('transactions', 'transactions.id', '=', 'payments.transaction_id')
                    ->select(
                        'payments.*',
                    )
                    ->where('transaction_items.program_id', '=', $user->training_program)
                    ->where('transactions.user_id', '=', Auth::id())
                    ->where(function($query) use($request) {
                        $query->where('transactions.price_type', $request->input('price_type'));
                    })
                    ->get();

                if (count($paymentsData) > 0) {
                    // Iterate and fetch installments where applicable
                    $remainingPayment = 0;
                    foreach ($paymentsData as $key => $payment) {
                        if ($payment->transaction_id !== null) {
                            $transaction = Transaction::getFirst($payment->transaction_id, 'id');
                            $payment->transaction = $transaction;
                        }

                        if ($payment->installment_id !== null) {
                            $installment = DB::table('installments')
                                                ->where('id', $payment->installment_id)
                                                ->first();
                            
                        } else {
                            if ($key == 0) {
                                $installment = DB::table('installments')
                                                ->where('payment_first_id', $payment->id)
                                                ->first();
                            } else {
                                $installment = null;
                            }
                        }

                        $payment->installment = $installment;

                        $paymentProof = PaymentProof::where('payment_id', $payment->id)
                                        ->where('status', '!=', PaymentProofStatusConstant::DENIED)
                                        ->select('id', 'uuid', 'date', 'amount', 'payment_id', 'transaction_id', 'status')
                                        ->first();
                        if ($paymentProof) {
                            $payment->payment_proof = $paymentProof;
                            $payment->payment_proof->status_label = PaymentProofStatusConstant::LIST[$paymentProof->status];

                            // count total left amount of installment
                            if ($paymentProof->status == PaymentProofStatusConstant::APPROVED) {
                                $remainingPayment += $paymentProof->amount;
                            }

                        } else {
                            $payment->payment_proof = null;
                        }
                    }

                    $price = Price::where('type', $request->input('price_type'))->where('program_id', $user->training_program)->first();
                    $totalAmount = $price->amount;
                    $leftAmount = $totalAmount - $remainingPayment;
                } else {
                    abort(404, "Data pembayaran untuk tipe transaksi ini tidak ditemukan");
                }
            }
        } else {
            abort(404, "Program pelatihan tidak ditemukan pada siswa ini");
        }
        
        $data['details']['total_amount'] = $totalAmount;
        $data['details']['left_amount'] = $leftAmount;
        $data['payments'] = $paymentsData;

        return $data;
    }

    public function updateStatusFullPayment($dataCallback)
    {
        $payment = Payment::with(['paymentDetail', 'transaction.user'])->where('uuid', $dataCallback['external_id'])->first();
        if (!empty($payment) && $payment->status == PaymentStatusConstant::PAID && $dataCallback['status'] == XenditCallbackStatusConstant::LIST[XenditCallbackStatusConstant::PAID]) {
            return response()->json(['message' => 'Invoice was already paid'], 200);
        }
        if (!empty($payment->paymentDetail) && !empty($payment->transaction)) {
            if ($dataCallback['status'] == XenditCallbackStatusConstant::LIST[XenditCallbackStatusConstant::PAID]) {
                //update payment status
                $payment->update([
                    'status' => PaymentStatusConstant::PAID,
                    'amount' => $dataCallback['amount'],
                    'updated_at' => now()
                ]);

                //update payment detail
                $payment->paymentDetail->update([
                    'paid_at' => $dataCallback['paid_at'],
                    'data_callback' => $dataCallback,
                    'updated_at' => now()
                ]);

                //update transaction
                $amount = $payment->total_left_amount - $dataCallback['amount'];
                $payment->transaction->update([
                    "total_left_amount" => $amount < 0 ? 0 : $amount,
                    "status" => $payment->transaction->price_type == PriceTypeConstant::ADMINSTRATION ? TransactionAdministrationStatusConstant::PAID : TransactionTrainingStatusConstant::PAID,
                    'updated_at' => now()
                ]);

                //update batch user transaction
                $batchUser = BatchUser::where('user_id', $payment->transaction->user_id)->first();
                $update = [
                    'updated_at' => now()
                ];
                if ($payment->transaction->price_type == PriceTypeConstant::ADMINSTRATION) {
                    $update['transaction_status'] = TransactionAdministrationStatusConstant::PAID;
                } else {
                    $update['transaction2_status'] = TransactionTrainingStatusConstant::PAID;
                }
                $batchUser->update($update);

                // update user's last phase into training phase
                setLastPhasePayment($batchUser);
            }

            if ($dataCallback['status'] == XenditCallbackStatusConstant::LIST[XenditCallbackStatusConstant::EXPIRED]) {
                $this->batchUserRepo->deletePaymentAndDetails($payment, $dataCallback);
                $this->createPaymentOfFullPayment($payment->transaction, $payment->transaction->price_type, $payment->transaction->user);
            }
            return response()->json(['message' => 'Invoice has been paid successfully'], 200);
        }

        return response()->json(['message' => 'Invoice was not found'], 200);
    }

    public function updateBatchUserTransactionInstallment($transaction)
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

    public function updateSuccessRecurringTrainingPayment($data, $payment, $transaction) {
        // create payment detail
        $paymentAdapter = PaymentAdapter::where('code', 'xendit')->first();
        $dtoPaymentDetail = [
            "payment_id" => $payment->id,
            "adapter_id" => $paymentAdapter->id,
            "paid_at" => now(),
            "number" => $data['id'],
            "checkout_url" => null,
            "expired_at" => null,
            "data_request" => null,
            "data_callback" => $data,
        ];
        PaymentDetail::create($dtoPaymentDetail);
        $amount_paid = $data['amount'];
        $payment->update([
            'status' => PaymentStatusConstant::PAID,
            'amount' => $amount_paid,
            'total' => $amount_paid,
        ]);
        
        // update payment proof
        $payment->paymentProof()->update([
            'amount' => $amount_paid,
            'status' => PaymentProofStatusConstant::APPROVED,
            'date' => now()
        ]);

        // Update transaction & batch users status
        $totalLeftAmount = $transaction->total_left_amount - $amount_paid;
        $transactionStatus = TransactionTrainingStatusConstant::INSTALLMENT;
        if($totalLeftAmount <= 0) {
            $transactionStatus = TransactionTrainingStatusConstant::PAID;
        }

        $transaction->update(['total_left_amount' => $totalLeftAmount, 'status' => $transactionStatus]);
        $batchUser = BatchUser::where('transaction2_id', $transaction->id)->where('user_id', $transaction->user_id)->first();
        
        $batchUser->update(['transaction2_status' => $transactionStatus]);

        // Update user last phase
        if($transactionStatus == TransactionTrainingStatusConstant::PAID && $batchUser->transaction_status == TransactionAdministrationStatusConstant::PAID) {
            $user = User::where('id', $transaction->user_id)->first();
            $user->update([
                'last_phase' => PhaseSettingConstant::PHASE_TRAINING,
                'join_date' => now(),
            ]);
        }

        return true;
    }

    public function updateScheduledRecurringTrainingPayment($data, $payment, $transaction) {
        $payment->update([
            'status' => PaymentStatusConstant::UNPAID,
            'number' => $data['id'],
        ]);
         // create payment proof
        PaymentProof::create([
            'payment_id' => $payment->id,
            'transaction_id' => $transaction->id,
            'currency_code' => "IDR",
            'amount' => $data['amount'],
            'status' => PaymentProofStatusConstant::SUBMITTED,
            'date' => $data['scheduled_timestamp'] ?? now(),
            'user_id' => $transaction->user_id,
        ]);

        return true;
    }

}