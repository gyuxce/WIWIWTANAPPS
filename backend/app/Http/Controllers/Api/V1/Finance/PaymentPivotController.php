<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Base\User;
use App\Services\BaseCrud\Traits\HasDBSafe;
use App\Services\PivotPaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PaymentPivotController extends  Controller
{
    use HasDBSafe;

    public $service;

    public function __construct()
    {
        $this->service = new PivotPaymentService();
    }

    public function getPaymentMethod()
    {
        $data = $this->service->access('get_payment_method');
        return response()->json($data, 200);
    }

    public function getPaymentDetails(Request $request, $id)
    {
        $data = $this->service->access('get_payment', null, ['Content-Type' => 'application/json'], ['payment_id' => $id]);
        return response()->json($data, 200);
    }

    public function callback(Request $request)
    {
        $data = $request->all();
        if (empty($data['data']) || empty($data['data']['id'])) {
            return response()->json([
                'message' => 'Invalid expected callback data'
            ], Response::HTTP_BAD_REQUEST);
        }

        $error = $this->service->checkPaymentStatus($data);

        //log error
        if (!is_bool($error)) {
            Log::error('Pivot Payment Callback Error: ' . $error, [
                'reference_number' => $data['data']['id']
            ]);
        }

        return response()->json([
            'message' => 'Callback processed successfully'
        ], 200);
    }
}
