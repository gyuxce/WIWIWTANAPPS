<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Models\Finance\PaymentContent;
use App\Http\Resources\V1\Finance\PaymentContentResource;
use App\Http\Requests\Api\V1\Finance\ApiPaymentContentRequest;
use App\Models\Finance\PaymentContentItem;
use App\Repositories\Finance\PaymentContentRepository;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class PaymentContentController extends BaseCrud {

    public $model = PaymentContent::class;
    public $resource = PaymentContentResource::class;
    public $storeValidator = ApiPaymentContentRequest::class;
    public $updateValidator = ApiPaymentContentRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public $paymentContentRepo;

    public function __construct()
    {
        $this->paymentContentRepo = new PaymentContentRepository();
    }

    public function getDetailPaymentContentMobile(Request $request)
    {
        $data = $this->paymentContentRepo->getDetailPaymentContentMobile($request);
        return response()->json([
            'status' => 'success',
            'data' => $data,
        ], Response::HTTP_OK);
    }

}
