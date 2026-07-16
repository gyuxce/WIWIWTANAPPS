<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\Invoice\InvoiceCallback;

class XenditService
{

    private $xenditUrl = 'https://api.xendit.co/';
    public function __construct()
    {
        Configuration::setXenditKey(env('XENDIT_SECRET_API_KEY'));
    }

    /**
     * Create a new payment invoice
     *
     *  $params = [
     *     "external_id": "payment-link-example",
     *     "amount": 100000,
     *     "description": "Invoice Demo #123",
     *     "invoice_duration":86400,
     *     "customer": {
     *         "given_names": "John",
     *         "surname": "Doe",
     *         "email": "johndoe@example.com",
     *         "mobile_number": "+6287774441111",
     *         "addresses": [
     *             {
     *                 "city": "Jakarta Selatan",
     *                 "country": "Indonesia",
     *                 "postal_code": "12345",
     *                 "state": "Daerah Khusus Ibukota Jakarta",
     *                 "street_line1": "Jalan Makan",
     *                 "street_line2": "Kecamatan Kebayoran Baru"
     *             }
     *         ]
     *     },
     *     "customer_notification_preference": {
     *         "invoice_created": [
     *             "whatsapp",
     *             "email",
     *             "viber"
     *         ],
     *         "invoice_reminder": [
     *             "whatsapp",
     *             "email",
     *             "viber"
     *         ],
     *         "invoice_paid": [
     *             "whatsapp",
     *             "email",
     *             "viber"
     *         ]
     *     },
     *     "success_redirect_url": "https://www.google.com",
     *     "failure_redirect_url": "https://www.google.com",
     *     "currency": "IDR",
     *     "items": [
     *         {
     *             "name": "Air Conditioner",
     *             "quantity": 1,
     *             "price": 100000,
     *             "category": "Electronic",
     *             "url": "https://yourcompany.com/example_item"
     *         }
     *     ],
     *     "fees": [
     *         {
     *             "type": "ADMIN",
     *            "value": 5000
     *         }
     *     ]
     *  ];
     */
    public function createInvoice($option_params = [])
    {
        return $this->exec(function () use ($option_params) {
            $apiInstance = new InvoiceApi();
            $params = new \Xendit\Invoice\CreateInvoiceRequest([
                'external_id' => $option_params['id'],
                'description' => $option_params['description'],
                'amount' => $option_params['amount'],
                'invoice_duration' => 172800,
                'currency' => $option_params['currency_code'],
                'success_redirect_url' => url('api/v1/mobile/finance/payment/success'),
                'failure_redirect_url' => url('api/v1/mobile/finance/payment/failed'),
                'reminder_time' => 1
            ]);
            $for_user_id = null;

            Log::info('Invoice Xendit');
            Log::info($params);

            return $apiInstance->createInvoice($params, $for_user_id);
        });
    }

    /**
     * Callback data
     *
     *  $params = [
     *     "id" => "593f4ed1c3d3bb7f39733d83",
     *     "external_id" => "testing-invoice",
     *     "user_id" => "5848fdf860053555135587e7",
     *     "payment_method" => "RETAIL_OUTLET",
     *     "status" => "PAID",
     *     "merchant_name" => "Xendit",
     *     "amount" => 2000000,
     *     "paid_amount" => 2000000,
     *     "paid_at" => "2020-01-14T02=>32=>50.912Z",
     *     "payer_email" => "test@xendit.co",
     *     "description" => "Invoice webhook test",
     *     "created" => "2020-01-13T02=>32=>49.827Z",
     *     "updated" => "2020-01-13T02=>32=>50.912Z",
     *     "currency" => "IDR",
     *     "payment_channel" => "ALFAMART",
     *     "payment_destination" => "TEST815"
     *  ];
     */
    public function setCallbackURL($params)
    {
        return $this->exec(function ()  use ($params) {
            $invCallback = new InvoiceCallback($params);
            return $invCallback->getId();
        });
    }

    public function getInvoiceById($invoice_id)
    {
        return $this->exec(function ()  use ($invoice_id) {
            $apiInstance = new InvoiceApi();
            return $apiInstance->getInvoiceById($invoice_id);
        });
    }

    public function expireInvoice($invoice_id)
    {
        return $this->exec(function () use ($invoice_id) {
            $apiInstance = new InvoiceApi();
            return $apiInstance->expireInvoice($invoice_id);
        });
    }

    public function createCustomer($params) {
        return $this->exec(function () use ($params) {
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode(env('XENDIT_SECRET_API_KEY') . ':'),
                'Content-Type' => 'application/json'
            ])->post($this->xenditUrl . 'customers', [
                    "reference_id" => $params['transaction_number'],
                    "type" => "INDIVIDUAL",
                    "individual_detail" => [
                      "given_names" => $params['customer_name'],
                    ],
                    "email" => $params['customer_email'],
                    "mobile_number" => $params['customer_phone']
            ]);
            $data = $response->json();
            if(empty($data['id'])) {
                abort(500, $data['message'] ?? 'Failed to create xendit customer');
            }
            return $data;
        });
    }
    
    public function createRecurringPlan($params = [])
    {
        return $this->exec(function () use ($params) {
            $body = [
                'customer_id' => $params['customer_id'],
                'recurring_action' => 'PAYMENT',
                'reference_id' => $params['reference_id'],
                'description' => $params['description'],
                'amount' => round($params['amount']),
                "notification_config" => [
                    "recurring_created" => ["EMAIL"],
                    "recurring_succeeded" => ["EMAIL"],
                    "recurring_failed" => ["EMAIL"],
                    "locale" => "en"
                ],
                'currency' => "IDR",
                'schedule' => [
                    'reference_id' => $params['reference_id'],
                    'interval' => $params['interval'],
                    'interval_count' => 1,
                    'total_recurrence' => (int) $params['total_recurrence'],
                    "retry_interval" => "DAY",
                    "retry_interval_count" => 3,
                    "total_retry" => 3,
                    "failed_attempt_notifications" => [1,2],
                ],
                'success_return_url' => url('api/v1/mobile/finance/payment/success'),
                'failure_return_url' => url('api/v1/mobile/finance/payment/failed'),
            ];
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode(env('XENDIT_SECRET_API_KEY') . ':'),
                'Content-Type' => 'application/json'
            ])->post($this->xenditUrl . 'recurring/plans', $body);
            $data = $response->json();
            if(empty($data['id'])) {
                abort(500, $data['message'] ?? 'Failed to create xendit recurring plan');
            }
            return $data;
        });
    }

    public function forceCycleRecurring($params = [])
    {
        return $this->exec(function () use ($params) {
            $url = $this->xenditUrl . 'recurring/plans/' . $params['plan_id'] . '/cycles/' . $params['recy_id'] . '/simulate';
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode(env('XENDIT_SECRET_API_KEY') . ':'),
                'Content-Type' => 'application/json'
            ])->post($url, [
                'amount' => (float) $params['amount'],
            ]);
        
            return $response->json();
        });
    }

    private function exec($func)
    {
        try {
            return $func();
        } catch (\Xendit\XenditSdkException $e) {
            abort(500, 'Xendit Error: ' . $e->getMessage());
        }
    }
}
