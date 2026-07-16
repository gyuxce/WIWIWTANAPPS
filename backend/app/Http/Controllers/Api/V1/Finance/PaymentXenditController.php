<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Constants\Finance\PaymentProofStatusConstant;
use App\Constants\Finance\PaymentStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
use App\Http\Controllers\Controller;
use App\Models\Finance\BatchUser;
use App\Models\Finance\Payment;
use App\Models\Finance\Transaction;
use App\Repositories\Finance\PaymentRepository;
use App\Services\BaseCrud\Traits\HasDBSafe;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PaymentXenditController extends  Controller
{
    use HasDBSafe;

    public $paymentRepo;
    public $xenditService;

    public function __construct()
    {
        $this->paymentRepo = new PaymentRepository();
        $this->xenditService = new XenditService();
    }

    public function callbackInvoice(Request $request)
    {
        Log::info('Xendit Callback: ', $request->all());

        return $this->DBSafe(
            function () use ($request) {
                $verify_token = $request->header('X-CALLBACK-TOKEN');
                if (empty($verify_token) || $verify_token != env('XENDIT_CALLBACK_VERIFY_TOKEN')) {
                    return abort(404, 'Missing or Invalid Verify Token Xendit');
                }

                $updateTransaction = $this->paymentRepo->updateStatusFullPayment($request);

                return $updateTransaction;
            }
        );
    }

    public function paymentSuccess()
    {
        return response()->json(['success' => true, 'message' => 'Payment success! Please wait while redirecting...'], Response::HTTP_OK);
    }

    public function paymentFailed()
    {
        return response()->json(['success' => false, 'message' => 'Payment failed! Please try again'], Response::HTTP_OK);
    }

    public function forceCycleRecurring(Request $request) {
        $data = $request->validate([
            'plan_id' => ['required'],
            'recy_id' => ['required'],
            'amount' => ['required', 'numeric'],
        ]);
        $data = $this->xenditService->forceCycleRecurring($data);
        return response()->json(['data' => $data], 200);
    }

    public function createCustomer(Request $request) {
        
        $data = $this->xenditService->createCustomer($request->all());
        return response()->json(['data' => $data], 200);
    }

    public function callbackRecurring(Request $request) {
        $data = $request->all();
        Log::info('data recurring ' . $data['event'] ?? '' , [
            'data' => $data,
        ]);

        return $this->DBSafe(
            function () use ($data, $request) {
                $verify_token = $request->header('X-CALLBACK-TOKEN');
                if (empty($verify_token) || $verify_token != env('XENDIT_CALLBACK_VERIFY_TOKEN')) {
                    return abort(404, 'Missing or Invalid Verify Token Xendit');
                }

                 // handle active plan
                if($data['event'] == "recurring.plan.activated") {
                    $data = $data['data'];
                    if($data['status'] == "ACTIVE") {
                        $transaction = Transaction::where([
                            'xendit_plan_id' => $data['id'],
                            'number' => $data['reference_id'],
                            'xendit_customer_id' =>  $data['customer_id']
                        ])->first();
                        $status = TransactionTrainingStatusConstant::INSTALLMENT;
                        if(!empty($transaction)) {
                            BatchUser::where('transaction2_id', $transaction->id)->update(['transaction2_status' => $status]);
                            $payment = Payment::where('transaction_id', $transaction->id)->orderBy('index', 'asc')->whereNull('status')->first();
                            $payment->paymentDetail()->update(["checkout_url" => null]);
                            $transaction->update([
                                'status' => $status
                            ]);
                        }
                    } 
                }
                
                // handle recurring cycle
                else if($data['event'] == "recurring.cycle.succeeded" || $data['event'] == "recurring.cycle.created" 
                || $data['event'] == "recurring.cycle.failed") {
                    $data = $data['data'];
                    $transaction = Transaction::where([
                        'xendit_plan_id' => $data['plan_id'],
                        'number' => $data['reference_id'],
                        'xendit_customer_id' =>  $data['customer_id']
                    ])->first();
                    $payment = Payment::where('transaction_id', $transaction->id)->orderBy('index', 'asc');
                  
                    // handle scheduled payment
                    if($data['status'] == "SCHEDULED") {
                        $payment = $payment->whereNull('status')->first();
                        $this->paymentRepo->updateScheduledRecurringTrainingPayment($data, $payment, $transaction);  
                    }
                    // handle success payment
                    else if($data['status'] == "SUCCEEDED") {
                        $payment = $payment->where('status', PaymentStatusConstant::UNPAID)->first();
                        $this->paymentRepo->updateSuccessRecurringTrainingPayment($data, $payment, $transaction);
                    }
                    // handle failed payment
                    else if($data['status'] == "FAILED") {
                        $payment = $payment->where('status', PaymentStatusConstant::UNPAID)->first();
                        $payment->update([
                            'status' => PaymentStatusConstant::FAILED,
                            'number' => $data['id'],
                        ]);
                         // create payment proof
                        $payment->paymentProof()->update([
                            'status' => PaymentProofStatusConstant::DENIED,
                            'date' => now(),
                        ]);
                    }
                }

                return response()->json(['success' => true], Response::HTTP_OK);
            }
        );
    }
}
