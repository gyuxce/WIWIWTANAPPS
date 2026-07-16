<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Constants\Finance\PaymentTypeConstant;
use App\Models\Finance\BatchUser;
use App\Http\Resources\V1\Finance\BatchUserResource;
use App\Http\Requests\Api\V1\Finance\ApiBatchUserRequest;
use App\Services\BaseCrud\BaseCrud;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\TrainingPreferenceConstant;
use App\Constants\Finance\TransactionAdministrationStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
use App\Models\Base\User;
use App\Models\Finance\Payment;
use App\Models\Finance\PaymentDetail;
use App\Models\Finance\Transaction;
use App\Repositories\Finance\BatchUserRepository;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Carbon\Carbon;
use DolphinMicroservice\Repositories\DolphinAuth;
use Symfony\Component\HttpFoundation\Response;

class BatchUserController extends BaseCrud {

    use HasLogHelper;

    public $model = BatchUser::class;
    public $resource = BatchUserResource::class;
    public $searchAble = ["user.name", "user.email"];
    public $storeValidator = ApiBatchUserRequest::class;
    public $updateValidator = ApiBatchUserRequest::class;
    public $defaultOrder = "uuid";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;
    public $batchUserRepo;

    public function __construct()
    {
        $this->batchUserRepo = new BatchUserRepository();
    }

    public function __afterStore()
    {
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

    public function export(\Illuminate\Http\Request $request)
    {
        $this->requestData = $request;
        $this->query = $this->model::query();
        $this->query = $this->__prepareQueryList();
        $this->query = $this->__prepareQuerySearchAbleList();
        $this->query = $this->__prepareQueryOptionsList();
        $data = $this->query->get();

        $data = $data->map(function ($row) {
            $ress = $row;
            $ress->program_type = TrainingProgramConstant::LIST[$row->program_id] ?? null;
            $ress->program_preference = TrainingPreferenceConstant::LIST[$row->user->training_preference] ?? null;
            $ress->status_administration = TransactionAdministrationStatusConstant::LIST[$row->transaction_status] ?? null;
            $ress->status_training = TransactionTrainingStatusConstant::LIST[$row->transaction2_status] ?? null;
            return $ress;
        });

        $fields = [
            "user->name",
            "user->email",
            "program_type",
            "program_preference",
            "status_administration",
            "status_training",
        ];

        $headings = [
            "Nama Siswa",
            "Email",
            "Program Pelatihan",
            "Preferensi Pelatihan",
            "Administrasi",
            "Pelatihan",
        ];

        $filename = app($this->model)->getTable() . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }

    public function getDetailUserMobile()
    {
        $user = User::getFirst(DolphinAuth::id(), 'id');
        $batchUser = BatchUser::where('user_id', $user->id)->first();
        if (!$batchUser) {
            return response()->json([
                'status' => 'success',
                'data' => null,
            ], Response::HTTP_OK);
        }

        $ress = [
            "administration_payment_type" => $batchUser->payment_type_administration,
            "administration_payment_type_label" => PaymentTypeConstant::LIST[$batchUser->payment_type_administration] ?? null,
            "administration_payment_xendit_link" => null,
            "administration_payment_xendit_status" => null,
            "administration_payment_due_date" => $batchUser->transaction_due_at,
            "is_administration_payment_completed" => false,
            "training_payment_type" => $batchUser->payment_type_training,
            "training_payment_type_label" => PaymentTypeConstant::LIST[$batchUser->payment_type_training] ?? null,
            "training_payment_xendit_link" => null,
            "training_payment_xendit_status" => null,
            "training_payment_due_date" => $batchUser->transaction2_due_at,
            "is_training_payment_completed" => false,
        ];

        // if ($batchUser->payment_type_administration == PaymentTypeConstant::FULL) {
        //     $transaction = Transaction::where('id', $batchUser->transaction_id)->first();
        //     $ress["administration_payment_xendit_link"] = $this->batchUserRepo->getXenditLink($transaction);

        //     if ($batchUser->transaction_status == TransactionAdministrationStatusConstant::PAID) {
        //         $ress["administration_payment_xendit_status"] = TransactionAdministrationStatusConstant::LIST[$batchUser->transaction_status];
        //         if ($transaction->total_left_amount == 0) {
        //             $ress["is_administration_payment_completed"] = true;
        //         }
        //     }
        // } else if ($batchUser->payment_type_administration == PaymentTypeConstant::INSTALLMENT) {
        //     $transaction = Transaction::where('id', $batchUser->transaction_id)->first();
        //     if(!empty($transaction)) {
        //         if ($transaction->total_left_amount == 0) {
        //             $ress["is_administration_payment_completed"] = true;
        //         }
        //     }
        // }

        $transaction = Transaction::where('id', $batchUser->transaction_id)->first();
        if ($transaction->total_left_amount == 0) {
            $ress["is_administration_payment_completed"] = true;
        }

        $transaction2 = Transaction::where('id', $batchUser->transaction2_id)->first();
        if (!empty($transaction2) && $transaction2->total_left_amount == 0) {
            $ress["is_training_payment_completed"] = true;
        }

        // if ($batchUser->payment_type_training == PaymentTypeConstant::FULL) {
        //     $transaction = Transaction::where('id', $batchUser->transaction2_id)->first();
        //     $ress["training_payment_xendit_link"] = $this->batchUserRepo->getXenditLink($transaction);

        //     if ($batchUser->transaction2_status == TransactionTrainingStatusConstant::PAID) {
        //         $ress["training_payment_xendit_status"] = TransactionTrainingStatusConstant::LIST[$batchUser->transaction2_status];
        //         if ($transaction->total_left_amount == 0) {
        //             $ress["is_training_payment_completed"] = true;
        //         }
        //     }
        // } else if ($batchUser->payment_type_training == PaymentTypeConstant::INSTALLMENT) {
        //     $transaction = Transaction::where('id', $batchUser->transaction2_id)->first();
        //     if(!empty($transaction)) {
        //         $ress["training_payment_xendit_link"] = $this->batchUserRepo->getXenditRecurringLink($transaction);
        //         if ($transaction->total_left_amount <= 0) {
        //             $ress["is_training_payment_completed"] = true;
        //         }
        //     }
        // }

        return response()->json([
            'status' => 'success',
            'data' => $ress,
        ], Response::HTTP_OK);
    }

}