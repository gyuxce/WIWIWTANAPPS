<?php

namespace App\Repositories\Finance;

use App\Constants\Finance\InstallmentPeriodTypeConstant;
use App\Constants\Finance\PaymentStatusConstant;
use App\Constants\Finance\PriceTypeConstant;
use App\Constants\Finance\TransactionAdministrationStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
use App\Constants\PhaseSettingConstant;
use App\Models\Base\User;
use App\Models\Finance\BatchUser;
use App\Models\Finance\Installment;
use App\Models\Finance\Payment;
use App\Models\Finance\PaymentDetail;
use App\Models\Finance\Transaction;
use App\Repositories\BaseRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class BatchUserRepository extends BaseRepository
{
    public function createOrUpdateBatchUser($dataTransaction, $dataRequest, $dataUser)
    {
        # create or update batch users
        $data['transaction'] = $dataTransaction;
        $data['price_type'] = $dataRequest['price_type'];
        $data['payment_type'] = $dataRequest['payment_type'];
        $batchUser = BatchUser::where('user_id', $dataUser->id)->first();
        if ($batchUser) {
            $query = $this->updateBatchUser($data, $dataUser);
        } else {
            $query = $this->createBatchUser($data, $dataUser);
        }

        return $query;
    }

    public function createBatchUser($data, $user)
    {
        $dtoBatchUser = [
            "user_id" => $user->id,
            "batch_id" => $user->training_program,
            "program_id" => $user->training_program,
        ];

        switch ($data['price_type']) {
            case PriceTypeConstant::ADMINSTRATION:
                $dtoBatchUser["transaction_id"] = $data['transaction']->id;
                $dtoBatchUser["payment_type_administration"] = $data['payment_type'];
                $dtoBatchUser["transaction_status"] = TransactionAdministrationStatusConstant::UNPAID;
                break;

            case PriceTypeConstant::TRAINING:
                $dtoBatchUser["transaction2_id"] = $data['transaction']->id;
                $dtoBatchUser["payment_type_training"] = $data['payment_type'];
                $dtoBatchUser["transaction2_status"] = TransactionTrainingStatusConstant::UNPAID;
                break;
        }
        // $this->setLastPhase($data, $user);
        $query = BatchUser::create($dtoBatchUser);
        return $query;
    }

    public function updateBatchUser($data, $user)
    {
        $dtoBatchUser = [
            'updated_at' => now(),
            'updated_by' => Auth::id(),
        ];
        switch ($data['price_type']) {
            case PriceTypeConstant::ADMINSTRATION:
                $dtoBatchUser["transaction_id"] = $data['transaction']->id;
                $dtoBatchUser["payment_type_adminstration"] = $data['payment_type'];
                break;

            case PriceTypeConstant::TRAINING:
                $dtoBatchUser["transaction2_id"] = $data['transaction']->id;
                $dtoBatchUser["payment_type_training"] = $data['payment_type'];
                break;
        }

        $query = BatchUser::where('user_id', $user->id)->first();

        if ($query && !empty($dtoBatchUser)) {
            $query->update($dtoBatchUser);
        }

        return $query;
    }

    public function getXenditLink($transaction)
    {
        $payment = $this->getFirstPayment($transaction);

        if ($payment && $this->isPaymentExpired($payment)) {
            $this->deletePaymentAndDetails($payment);
            return null;
        }

        return $payment ? $payment->paymentDetail?->checkout_url : null;
    }

    public function getXenditRecurringLink($transaction)
    {
        $paymentDetail = $this->getCurrentPaymentDetail($transaction);
        return $paymentDetail ? $paymentDetail->checkout_url : null;
    }

    public function getCurrentPaymentDetail($transaction) {
        $payment = Payment::where('transaction_id', $transaction->id)
        ->where(function ($query) {
            $query->whereNot('status', PaymentStatusConstant::PAID)
                  ->orWhereNull('status');
        })->orderBy('index', 'asc')->first();
        $paymentDetail = PaymentDetail::where('payment_id', $payment?->id)->whereNotNull('checkout_url')->first();
        return $paymentDetail;
    }

    private function getFirstPayment($transaction)
    {
        return count($transaction->payments) > 0 ? $transaction->payments[0] : null;
    }

    private function isPaymentExpired($payment)
    {
        if (!$payment->paymentDetail) {
            return false;
        }

        $expiryDateTimestamp = Carbon::parse($payment->paymentDetail->expired_at);
        return $expiryDateTimestamp->lt(Carbon::parse(now()));
    }

    public function deletePaymentAndDetails($payment, $dataCallback = null)
    {
        $paymentDetail = PaymentDetail::where('payment_id', $payment->id)->first();

        if ($payment) {
            $payment->update([
                'status' => PaymentStatusConstant::FAILED,
                'updated_at' => now(),
                'updated_by' => Auth::id(),
            ]);
            $payment->delete();
        }

        if ($paymentDetail) {
            $paymentDetail->update([
                'data_callback' => $dataCallback,
                'updated_at' => now(),
                'updated_by' => Auth::id(),
            ]);
            $paymentDetail->delete();
        }

        return true;
    }

    public function updateBatchUserTransaction($transaction)
    {
        $dtoBatchUser = [
            'updated_at' => now(),
            'updated_by' => Auth::id(),
        ];
        switch ($transaction->price_type) {
            case PriceTypeConstant::ADMINSTRATION:
                $dtoBatchUser["transaction_status"] = TransactionAdministrationStatusConstant::PAID;
                break;

            case PriceTypeConstant::TRAINING:
                $dtoBatchUser["transaction2_status"] = TransactionTrainingStatusConstant::PAID;
                break;
        }

        $query = BatchUser::where('user_id', $transaction->user_id)->first();

        if ($query && !empty($dtoBatchUser)) {
            $query->update($dtoBatchUser);
        }

        return $query;
    }

    private function getStatusValue($constantClass, $status)
    {
        $constantName = "{$constantClass}::{$status}";
        return defined($constantName) ? constant($constantName) : null;
    }

    protected function setLastPhase($data, $user)
    {
        $last_phase = '';
        switch ($data['price_type']) {
            case PriceTypeConstant::ADMINSTRATION:
                $last_phase = PhaseSettingConstant::PHASE_PAYMENT;

                break;

            case PriceTypeConstant::TRAINING:
                $last_phase = PhaseSettingConstant::PHASE_TRAINING;
                break;
        }
        User::where('id', $user->id)->update([
            'last_phase' => $last_phase
        ]);
    }
}
