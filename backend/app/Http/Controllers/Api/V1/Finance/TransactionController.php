<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Constants\Finance\PaymentStatusConstant;
use App\Constants\Finance\PaymentTypeConstant;
use App\Constants\Finance\PriceTypeConstant;
use App\Constants\Finance\TransactionAdministrationStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
use App\Models\Finance\Transaction;
use App\Http\Resources\V1\Finance\TransactionResource;
use App\Http\Requests\Api\V1\Finance\ApiTransactionRequest;
use App\Http\Resources\V1\Finance\PaymentMobilePivotResource;
use App\Http\Resources\V1\Finance\TransactionMobileResource;
use App\Models\Base\User;
use App\Models\Finance\BatchUser;
use App\Models\Finance\Installment;
use App\Models\Finance\Payment;
use App\Models\Finance\PaymentDetail;
use App\Models\Finance\Price;
use App\Repositories\Finance\BatchUserRepository;
use App\Repositories\Finance\InstallmentRepository;
use App\Repositories\Finance\PaymentDetailRepository;
use App\Repositories\Finance\PaymentRepository;
use App\Repositories\Finance\TransactionItemRepository;
use App\Repositories\Training\UserCourseItemRepository;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasFileTypeHelper;
use App\Services\BaseCrud\Traits\HasLogHelper;
use App\Services\PivotPaymentService;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Services\XenditService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use OpenApi\Annotations\Trace;

class TransactionController extends BaseCrud
{

    use HasFileTypeHelper, HasLogHelper;

    public $model = Transaction::class;
    public $resource = TransactionResource::class;
    public $storeValidator = ApiTransactionRequest::class;
    public $updateValidator = ApiTransactionRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public $paymentRepo, $installmentRepo, $transactionItemRepo, $batchUserRepo, $paymentDetailRepo, $userCourseItemRepo, $xenditService;

    public function confirm(Request $request, $payment_id):Payment
    {
        $user = Auth::user();

        //validate transaction
        $payment = Payment::findOrFail($payment_id);
        if (empty($payment) || $user->id !== $payment->user_id) {
            throw new \Exception('Transaksi tidak ditemukan');
        }

        return new Payment();
    }

    public function testInstallmentAmountLogic(Request $request)
    {
        $data = $request->validate([
            'transaction_id' => ['required', 'numeric', 'exists:transactions,id'],
            'last_payment_date' => ['nullable', 'date'],
        ]);

        $transaction = Transaction::with(['payments', 'installment'])->where('id', $data['transaction_id'])->first();
        $amount = Installment::calculateNextInstallment($transaction, $data['last_payment_date'] ?? null);

        return response()->json([
            'status' => 'success',
            'data' => $amount
        ], Response::HTTP_OK);
    }
        

    public function pay(Request $request)
    {
        $data_response = null;
        $user = Auth::user();

        //validate payload data
        $data = $request->validate([
            'price_type' => ['required', 'numeric', Rule::in([PriceTypeConstant::ADMINSTRATION, PriceTypeConstant::TRAINING])],
            'method' => ['nullable', 'in:VIRTUAL_ACCOUNT,CARD,QRIS,EWALLET'],
            'provider' => ['nullable', 'in:SMBC,BCA,BSI,BNC,BNI,CIMB,MANDIRI,PERMATA,BRI,DANA,OVO,SHOPEEPAY,VISA,MASTERCARD,JCB']
        ]);
        
        //validate transaction
        $transaction = Transaction::with(['payments', 'installment'])->where('price_type', $data['price_type'])->where('user_id', $user->id)->orderBy('updated_at', 'desc')->first();

        //get existing unpaid payment
        $existing_payment = null;
        $service = new PivotPaymentService;
        try {
            //validate transaction status
            if (($transaction->type == PriceTypeConstant::ADMINSTRATION && $transaction->status == TransactionAdministrationStatusConstant::PAID) ||
                ($transaction->type == PriceTypeConstant::TRAINING && $transaction->status == TransactionTrainingStatusConstant::PAID) ||
                $transaction->total_left_amount == 0) {
                throw new \Exception('Transaksi sudah lunas');
            }

            $existing_payment = PaymentController::getLatestPayment($transaction);
        } catch(\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }

        if (!empty($existing_payment)) {
            return response()->json([
                'status' => 'success',
                'data' => $existing_payment
            ], Response::HTTP_OK);
        }

        $service = new PivotPaymentService;
        if (!empty($transaction->installment)) {
            $amount = Installment::calculateNextInstallment($transaction);
        }

        //make sure both method and provider exists
        if ((empty($data['method']) && empty($data['provider'])) || (!in_array($data['method'], ['QRIS', 'CARD']) && empty($data['provider']))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pembayaran baru harus mengisi metode dan provider'
            ], Response::HTTP_BAD_REQUEST);
        }

        //generate payment session data
        $data['method'] = $service->mapMethod($data['method']);
        $data_request = $service->generatePaymentSessionData($data['method'], $user, $transaction, $data['provider'] ?? null);

        //generate request and reference ids
        //$ids = $service->getRequestId($data_request);
//THIS IS JUST A WORKAROUND OF PG's BUG
$ids = [
    'request_id' => $service->generateRandomString(),
    'reference_id' => $service->generateRandomString(),
    'expiry_at' => $service->getPaymentExpiryDate(),
    'hash' => null
];
        $request_id = $ids['request_id'];
        $reference_id = $ids['reference_id'];
        $data_request['clientReferenceId'] = $reference_id;
        $data_request['expiryAt'] = $ids['expiry_at'];

        //hit create payment session endpoint
        $data_response = $service->access('create_payment', $data_request, [
            'Content-Type' => 'application/json',
            'X-REQUEST-ID' => $request_id
        ]);

        $id = $data_response['data']['chargeDetails'][0]['paymentSessionId'] ?? $data_response['data']['id'];

        //prepare data
        $payment_data = [
            'request_id' => $request_id,
            'request' => $data_request,
            'response' => $data_response['data']
        ];
        if ($data_response['data']['paymentMethod']['type'] === 'CARD') {
            $payment_data['step'] = 'encrypt';
        }
        $expiry = $data_response['data']['expiryAt'];
        if (!empty($transaction->installment)) {
            $expiry = Carbon::now()->endOfMonth()->endOfDay();
        }
        $new = [
            "number_ref" => $id,
            "adapter" => 'pivot-payment::' . $data['method'],
            "transaction_id" => $transaction->id,
            "amount" => empty($transaction->installment) ? $transaction->total_amount : $amount,
            "total" => $data_response['data']['chargeDetails'][0]['amount']['value'] ?? $data_response['data']['amount']['value'],
            "expired_at" => $expiry,
            "installment_id" => $transaction->installment?->id ?? null,
            "currency_code" => $data_response['data']['chargeDetails'][0]['amount']['currency'] ?? $data_response['data']['amount']['currency'],
            "index" => 1,
            "data" => json_encode($payment_data),
            "status" => PaymentStatusConstant::UNPAID
        ];

        $result = null;
        try {
            DB::beginTransaction();

            //set customer id
            if (empty($user->customer_id)) {
                $user->customer_id = $data_response['data']['customerId'];
                $user->save();
            }

            //create new payment
            $payment = Payment::create($new);
            $result = new PaymentMobilePivotResource($payment);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            //cancel payment session
            // if (!empty($data_response)) {
            //     $service->access('cancel_payment', ['CancellationReason' => 'Invalid payment due to processing error'], ['Content-Type' => 'application/json'], ['payment_id' => $id]);
            // }
            
            //delete cached request id
            cache()->forget('pivot_payment_request_id_' . $ids['hash']);

            throw new \Exception($e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'data' => $result,
        ], Response::HTTP_OK);
    }

    public function latest(Request $request)
    {
        $user = Auth::user();

        //validate payload data
        $data = $request->validate([
            'price_type' => ['required', 'numeric', Rule::in([PriceTypeConstant::ADMINSTRATION, PriceTypeConstant::TRAINING])]
        ]);
        
        //validate transaction
        $transaction = Transaction::with(['payments', 'installment'])->where('price_type', $data['price_type'])->where('user_id', $user->id)->orderBy('updated_at', 'desc')->first();
        $result = null;
        if (!empty($transaction)) {
            $result = new TransactionMobileResource($transaction);
        }

        return response()->json([
            'status' => 'success',
            'data' => $result
        ], Response::HTTP_OK);
    }

    public function initiate(Request $request)
    {
        $err = null;
        $user = Auth::user();

        //validate payload data
        $requestData = $request->validate([
            'price_type' => ['required', 'numeric', Rule::in([PriceTypeConstant::ADMINSTRATION, PriceTypeConstant::TRAINING])],
            'payment_type' => ['required', 'numeric', Rule::in([PaymentTypeConstant::FULL, PaymentTypeConstant::INSTALLMENT])],
            'total_recurrence' => ['nullable', 'numeric']
        ]);

        //validate user data
        if (empty($user->join_reason)) {
            $err = 'Anda belum mengisi alasan bergabung dengan Wiwitan';
        }
        if (empty($user->training_program)) {
            $err = 'Anda belum memilih program pelatihan';
        }

        $record = Transaction::where('user_id', $user->id)->where('price_type', $requestData['price_type'])->orderBy('updated_at', 'desc')->first();
        $price = Price::where('type', $requestData['price_type'])->where('program_id', $user->training_program)->first();
        if (!empty($record) && empty($price)) {
            $err = 'Harga program tidak ditemukan';
        }

        //throw error message
        if (!empty($err)) {
            throw new \Exception($err);
        }

        //create new record
        if (!empty($record)) { return $record; }

        $record = new Transaction();
        $amount = $price->amount;
        $record->status = $requestData['price_type'] == PriceTypeConstant::TRAINING ? TransactionTrainingStatusConstant::UNPAID : TransactionAdministrationStatusConstant::UNPAID;
        $record->total = $amount;
        $record->total_amount = $amount;
        $record->user_id = $user->id;
        $record->issued_at = now();
        $record->number = $this->generateTransactionNumber($requestData['price_type']);
        $record->price_type = $requestData['price_type'];
        $record->currency_code = "IDR";
        $record->total_left_amount = $amount;
        $record->created_by = $user->id;

        try {
            DB::beginTransaction();

            $record->save();
      
            # create transaction items
            $this->transactionItemRepo->createTransactionItem($record, $user->training_program);

            if ($requestData['price_type'] == PriceTypeConstant::TRAINING) {
                # generarte user course items for assesment verbal (assesmen lisan)
                $this->userCourseItemRepo->createUserCourseItemFromPayment($user);
            }

            if ($requestData['payment_type'] == PaymentTypeConstant::INSTALLMENT) {
                $data['transaction'] = $record;
                $this->installmentRepo->createInstallment($data);
                $record->load('installment');
            }

            # create or update batch users
            $this->batchUserRepo->createOrUpdateBatchUser($record, $requestData, $user);
            
            # insert to log
            $dataLog = ["uuid" => $record->uuid, "label" => $record->number];
            $this->__insertLog($dataLog, "created", null);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception($e->getMessage());
        }
        
        //format output
        $result = new TransactionMobileResource($record);

        return response()->json([
            'status' => 'success',
            'data' => $result,
        ], Response::HTTP_OK);
    }

    public function __construct()
    {
        $this->paymentRepo = new PaymentRepository();
        $this->installmentRepo = new InstallmentRepository();
        $this->transactionItemRepo = new TransactionItemRepository();
        $this->batchUserRepo = new BatchUserRepository();
        $this->paymentDetailRepo = new PaymentDetailRepository();
        $this->userCourseItemRepo = new UserCourseItemRepository();
        $this->xenditService = new XenditService();
    }

    public function store(Request $request)
    {
        $requestData = $request->all();
        $user = Auth::user();

        //check existing transaction
        $record = Transaction::where('user_id', $user->id)->where('price_type', $requestData['price_type'])->first();

        if (!empty($record) && $requestData['payment_type'] == PaymentTypeConstant::FULL) {
            $payment = Payment::where('transaction_id', $record->id)->first();
            $is_new_payment = false;
            $paymentDetail = null;
            if (!empty($payment)) {
                $paymentDetail = PaymentDetail::where('payment_id', $payment->id)->first();
                $now = Carbon::now();
                
                if (empty($paymentDetail) || $paymentDetail->expired_at && $now->greaterThanOrEqualTo(Carbon::parse($paymentDetail->expired_at))) {
                    $this->batchUserRepo->deletePaymentAndDetails($payment);
                    $is_new_payment = true;
                }
            } else {
                $is_new_payment = true;
            }
            if ($is_new_payment) {
                $paymentDetail = $this->paymentRepo->createPaymentOfFullPayment($record, $requestData['price_type'], $user);
            }
            
            return response()->json([
                'status' => 'success',
                'data' => $paymentDetail,
            ], Response::HTTP_OK);
        }
        else if (!empty($record) && $requestData['payment_type'] == PaymentTypeConstant::INSTALLMENT) {
            return response()->json([
                'status' => 'success',
                'message' => [],
            ], Response::HTTP_OK);
        }

        parent::store($request);
    }

    private function generateTransactionNumber($type) {
        $result = '';
        if ($type == PriceTypeConstant::ADMINSTRATION) {
            $result = Transaction::TYPE_ADMINSTRATION; 
        } else if ($type == PriceTypeConstant::TRAINING) {
            $result = Transaction::TYPE_TRAINING;
        } else {
            throw new \Exception('Unknown price type');
        }
        $lastTransaction = Transaction::withTrashed()->latest()->count();
        $result .= str_pad($lastTransaction + 1, 6, '0', STR_PAD_LEFT) . time();

        return $result;
    }

    public function __prepareDataStore($data)
    {
        // $transaction = Transaction::where('user_id', Auth::id())
        //     ->where('price_type', $data['price_type'])
        //     ->first();
        // if ($transaction) {
        //     abort(404, "Transaksi " . PriceTypeConstant::LIST[$data['price_type']] . " anda telah dibuat");
        // }

        $user = User::where('id', Auth::id())->first();
        if (empty($user->join_reason)) {
            abort(422, 'Anda belum mengisi alasan bergabung dengan Wiwitan');
        }

        // auto create transaction number to filed transaction ID
        $lastTransaction = Transaction::withTrashed()->latest()->count();
        $paddedNumber = str_pad($lastTransaction + 1, 6, '0', STR_PAD_LEFT);
        if ($data['price_type'] == PriceTypeConstant::ADMINSTRATION) {
            $transactionNumber = Transaction::TYPE_ADMINSTRATION . $paddedNumber . time();
            $priceType = PriceTypeConstant::ADMINSTRATION;
        }
        if ($data['price_type'] == PriceTypeConstant::TRAINING) {
            $transactionNumber = Transaction::TYPE_TRAINING . $paddedNumber . time();
            $priceType = PriceTypeConstant::TRAINING;
        }

        $price = Price::where('type', $data['price_type'])->where('program_id', $user->training_program)->first();

        $amount = $price->amount;
        $data['status'] = $data['price_type'] == PriceTypeConstant::TRAINING ? TransactionTrainingStatusConstant::UNPAID : TransactionAdministrationStatusConstant::UNPAID;
        $data['total'] = $amount;
        $data['total_amount'] = $amount;
        $data["user_id"] = Auth::id();
        $data["issued_at"] = now();
        $data["number"] = $transactionNumber;
        $data['price_type'] = $priceType;
        $data["currency_code"] = "IDR";
        $data["total_left_amount"] = $amount;

        return $data;
    }

    public function __afterStore()
    {
        $user = User::getFirst($this->row->user_id, 'id');

        # create transaction items
        $this->transactionItemRepo->createTransactionItem($this->row, $user->training_program);

        if ($this->requestData['price_type'] == PriceTypeConstant::TRAINING) {
            # generarte user course items for assesment verbal (assesmen lisan)
            $this->userCourseItemRepo->createUserCourseItemFromPayment($user);
        }

        if ($this->requestData['payment_type'] == PaymentTypeConstant::INSTALLMENT) {
            $recurringPlan = null;
            $totalInstallment = config('pivot-payment.installment_total');
            $total_recurrence = $this->requestData['total_recurrence'] ?? $totalInstallment;
            if ($this->row->price_type == PriceTypeConstant::TRAINING) {
                // create recurring customer
                $customerParams = [
                    "transaction_number" => $this->row->number,
                    "customer_name" => $user->name,
                    "customer_email" => $user->email,
                    "customer_phone" => $user->phone,
                ];
                $customerXendit = $this->xenditService->createCustomer($customerParams);
                $amount = $this->row->total / $total_recurrence;
                //create recurring plan
                $recurringParams = [
                    "customer_id" => $customerXendit['id'],
                    "reference_id" => $this->row->number,
                    "description" => 'Recurring Training Payment for customer: ' . $user->name,
                    "amount" => $amount,
                    "interval" => "MONTH",
                    "total_recurrence" => $total_recurrence,
                ];
                $recurringPlan = $this->xenditService->createRecurringPlan($recurringParams);
                $this->row->update([
                    "xendit_customer_id" => $customerXendit['id'],
                    "xendit_plan_id" => $recurringPlan['id'],
                ]);
            }

            # create payment
            $payments = $this->paymentRepo->createPaymentOfInstallment($this->row, $recurringPlan, $total_recurrence);

            # create installment
            $data['payments'] = $payments;
            $data['transaction'] = $this->row;
            $this->installmentRepo->createInstallment($data);

            # create or update batch users
            $this->batchUserRepo->createOrUpdateBatchUser($this->row, $this->requestData, $user);
        } else if ($this->requestData['payment_type'] == PaymentTypeConstant::FULL) {

            # create payment & xendit invoice
            $payments = $this->paymentRepo->createPaymentOfFullPayment($this->row, $this->requestData['price_type'], $user);

            # create or update batch users
            $this->batchUserRepo->createOrUpdateBatchUser($this->row, $this->requestData, $user);

            return response()->json([
                'status' => 'success',
                'data' => $payments,
            ], Response::HTTP_OK);
        }

        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->number];
        $this->__insertLog($dataLog, "created", null);

        return response()->json([
            'status' => 'success',
            'message' => [],
        ], Response::HTTP_OK);
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->number];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function getDetailPayment(Request $request)
    {
        $data = $this->paymentRepo->getDetailPaymentOfInstallment($request);
        return response()->json([
            'status' => 'success',
            'data' => $data,
        ], Response::HTTP_OK);
    }
}
