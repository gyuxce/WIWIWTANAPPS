<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Models\Finance\Price;
use App\Http\Resources\V1\Finance\PriceResource;
use App\Http\Requests\Api\V1\Finance\ApiPriceRequest;
use App\Services\BaseCrud\BaseCrud;
use App\Constants\Finance\PriceTypeConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\TrainingPreferenceConstant;
use App\Models\Base\File;
use App\Models\Base\User;
use App\Services\BaseCrud\Traits\HasLogHelper;
use DolphinMicroservice\Repositories\DolphinAuth;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PriceController extends BaseCrud
{
    use HasLogHelper;
    public $model = Price::class;
    public $resource = PriceResource::class;
    public $storeValidator = ApiPriceRequest::class;
    public $updateValidator = ApiPriceRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;
    public $searchAble = ["type_label"];

    public function __prepareDataStore($data)
    {
        if (isset($data['type'])) {
            if ($data['type'] == PriceTypeConstant::ADMINSTRATION) {
                $data['type'] = PriceTypeConstant::LIST[$data['type']];
            }

            if ($data['type'] == PriceTypeConstant::TRAINING) {
                $data['type'] = PriceTypeConstant::LIST[$data['type']];
            }
        }

        $data['training_letter_file_id'] = isset($data['training_letter_file_id']) ? File::getId($data['training_letter_file_id']) : null;
        $data['installment_letter_file_id'] = isset($data['installment_letter_file_id']) ? File::getId($data['installment_letter_file_id']) : null;

        return $data;
    }

    public function __prepareDataUpdate($data)
    {
        $data = $this->__prepareDataStore($data);

        $keysToCheck = ['training_letter_file_id', 'installment_letter_file_id', 'amount'];
        foreach ($keysToCheck as $key) {
            if (!isset($data[$key])) {
                unset($data[$key]);
            }
        }

        $alwaysUnsetKeys = ['type', 'subtype', 'program_id'];
        foreach ($alwaysUnsetKeys as $key) {
            unset($data[$key]);
        }

        return $data;
    }

    public function __afterStore()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->type_label];
        $this->__insertLog($dataLog, "created", null);
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->type_label];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }
    
    public function getDetail($type)
    {
        $user = User::getFirst(DolphinAuth::id(), 'id');
        if ($user->training_program) {
            $price = Price::where('type', $type)->where('program_id', $user->training_program)->with('trainingLetter')->with('installmentLetter')->first();
        } else {
            abort(400, "Program pelatihan tidak ditemukan pada siswa ini");
        }

        return response()->json([
            'status' => 'success',
            'data' => new PriceResource($price),
        ], Response::HTTP_OK);
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
            $ress->type = PriceTypeConstant::LIST[$row->type] ?? null;
            $ress->program_id = TrainingProgramConstant::LIST[$row->program_id] ?? null;
            $ress->subtype = TrainingPreferenceConstant::LIST[$row->subtype] ?? null;
            return $ress;
        });

        $fields = [
            "type",
            "program_id",
            "subtype",
            "amount",
        ];

        $headings = [
            "Tipe Pembayaran",
            "Program Pelatihan",
            "Preferensi",
            "Harga Paket (Rp)",
        ];

        $filename = app($this->model)->getTable() . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }
}
