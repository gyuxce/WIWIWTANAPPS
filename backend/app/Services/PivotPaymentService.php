<?php

namespace App\Services;

use App\Constants\Finance\PaymentStatusConstant;
use App\Constants\Finance\PaymentTypeConstant;
use App\Constants\Finance\PriceTypeConstant;
use App\Constants\Finance\TransactionAdministrationStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
use App\Constants\PhaseSettingConstant;
use App\Models\Base\User;
use App\Models\Finance\BatchUser;
use App\Models\Finance\Installment;
use App\Models\Finance\Payment;
use App\Models\Finance\Transaction;
use App\Models\Master\Cities;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PivotPaymentService
{
    public $phone_country_codes;

    public function __construct() {
        $this->phone_country_codes = config('pivot-payment.phone_country_codes', []);
    }

    public function checkPaymentStatus($data) {
        //validate data
        if(!is_array($data) || empty($data['data'])) { return 'Invalid data'; }
        if(empty($data['data']['id'])) { return true; }
        
        $payment = Payment::where('number_ref', $data['data']['id'])->with(['transaction.user', 'transaction.installment'])->first();
        if (empty($payment) || empty($payment->transaction)) { return 'Payment was not found'; }

        $id = $data['data']['id'];
        $status = $data['data']['status'];
        $paid_at = $data['data']['chargeDetails'][0]['paidAt'] ?? null;

        if (empty($id) || empty($status)) { return 'Invalid data'; }
        if (in_array($payment->status, [PaymentStatusConstant::FAILED, PaymentStatusConstant::PAID])) { return 'Payment was already processed'; }

        //update payment response
        if (!empty($payment)) {
            $json_data = json_decode($payment->data, true);
            $json_data['response'] = $data['data'];
            $payment->data = json_encode($json_data);
        }

        //update payment status
        $now = Carbon::now();
        switch($status) {
            case 'PAID':
                $payment->status = PaymentStatusConstant::PAID;
                //update transaction
                break;
            case 'EXPIRED':
            case 'CANCELLED':
                $payment->status = PaymentStatusConstant::FAILED;
                $payment->save();
                return false;
            case 'REQUIRE_ACTION':
            case 'REQUIRE_CONFIRMATION':
            case 'PROCESSING':
                //check if expired
                $expired = Carbon::parse($data['data']['expiryAt']);
                if ($now >= $expired) {
                    $payment->status = PaymentStatusConstant::FAILED;
                    $payment->save();
                }

                return $payment;
            default:
                return 'Unhandled payment status';
        }
        $payment->save();

        //update charged amount
        $charged_amount = $data['data']['chargeDetails'][0]['amount']['value'] ?? null;
        $payment->total = !empty($charged_amount) ? $charged_amount : $payment->total;
        
        //update left amount
        $left_amount = $payment->transaction->total_left_amount - $payment->amount;
        $left_amount = $left_amount <= 0 ? 0 : $left_amount;
        $payment->transaction->total_left_amount = $left_amount;

        //make sure transaction_id is correct
        $batch_user = BatchUser::where('user_id', $payment->transaction->user_id)->first();
        if (empty($batch_user)) { return 'Corrupted user data'; }
        if ($payment->transaction->price_type == PriceTypeConstant::ADMINSTRATION) {
            $batch_user->transaction_id = $payment->transaction->id;
        } elseif ($payment->transaction->price_type == PriceTypeConstant::TRAINING) {
            $batch_user->transaction2_id = $payment->transaction->id;
        }

        //update last paid and due
        $batch_user->transaction2_last_at = $paid_at ? Carbon::parse($paid_at) : $now;
        if (!empty($payment->transaction->installment) && $left_amount > 0) {
            $grace_days = env('PAYMENT_DUE_GRACE', 7);
            $due = $batch_user->transaction2_last_at->copy()->addMonth()->addDays($grace_days);
            $batch_user->transaction2_due_at = $due;
        }

        //update transaction status if all paid
        if ($left_amount == 0) {
            if ($payment->transaction->price_type == PriceTypeConstant::ADMINSTRATION) {
                $payment->transaction->status = TransactionAdministrationStatusConstant::PAID;
                $batch_user->transaction_status = TransactionAdministrationStatusConstant::PAID;
            } elseif ($payment->transaction->price_type == PriceTypeConstant::TRAINING) {
                $payment->transaction->status = TransactionTrainingStatusConstant::PAID;
                $batch_user->transaction2_status = TransactionTrainingStatusConstant::PAID;
                $batch_user->transaction2_due_at = null;
            }
        }

        //update user subscription status
        $batch_user->user->is_subscription_active = true;
        
        //save data
        $payment->transaction->save();
        $payment->save();
        $batch_user->user->save();
        $batch_user->save();

        //update installment
        if (!empty($payment->transaction->installment)) {
            if (empty($payment->transaction->installment->payment_first_at)) {
                $payment->transaction->installment->payment_first_id = $payment->id;
                $payment->transaction->installment->payment_first_at = $now;
            }
            $payment->transaction->installment->payment_last_id = $payment->id;
            $payment->transaction->installment->payment_last_at = $now;
            $payment->transaction->installment->index = Payment::where('transaction_id', $payment->transaction_id)->where('status', PaymentStatusConstant::PAID)->count();
            if ($left_amount == 0) { $payment->transaction->installment->is_paid = true; }

            $payment->transaction->installment->save();
        }

        //update user's phase if both admin & training has been paid
        $transactions = Transaction::whereIn('id', array_unique([$batch_user->transaction_id, $batch_user->transaction2_id]))->get();
        $is_admin_paid = false;
        $is_training_paid = false;
        foreach($transactions as $_transaction) {
            if ($_transaction->price_type == PriceTypeConstant::ADMINSTRATION && $_transaction->status == TransactionAdministrationStatusConstant::PAID) { $is_admin_paid = true; }
            if ($_transaction->price_type == PriceTypeConstant::TRAINING && $_transaction->total_left_amount != $_transaction->total_amount) { $is_training_paid = true; }
        }
        if ($is_admin_paid && $is_training_paid) {
            $payment->transaction->user->last_phase = PhaseSettingConstant::PHASE_TRAINING;
            $payment->transaction->user->join_date = $now;
            $payment->transaction->user->save();
        }

        return true;
    }

    private function sortArrayRecursive(array $array): array {
        ksort($array);
        foreach ($array as &$value) {
            if (is_array($value)) {
                $value = $this->sortArrayRecursive($value);
            }
        }
        return $array;
    }

    public function getRequestId($payload) {
        //sort the payload keys and values to ensure consistent order
        $sorted = $this->sortArrayRecursive($payload);

        //encode the payload to a JSON string
        $json_payload = json_encode($sorted, JSON_UNESCAPED_SLASHES);

        //hash the JSON string to create a unique identifier
        $hash = hash('sha256', $json_payload);
        $key = 'pivot_payment_request_id_' . $hash;
        
        //check if the has is in cache
        $cached = cache()->get($key);
        if (!empty($cached)) {
            return $cached;
        } else {
            //generate a new request ID & reference ID
            $data = [
                'request_id' => $this->generateRandomString(),
                'reference_id' => $this->generateRandomString(),
                'expiry_at' => $this->getPaymentExpiryDate(),
                'hash' => $hash
            ];

            //store the hash in cache with a 5 minute expiration
            cache()->put($key, $data, now()->addDay());
            return $data;
        }
    }

    private function handleResponse($response) {
        $result = $response->json();
        if (!$response->successful()) {
            $msg = 'Pivot Payment error: ';
            Log::error($msg, [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \Exception($msg . ($result['message'] ?? 'Unknown error'), $response->status());
        }
        return $result;
    }

    public function getPath($endpoint = null) {
        $endpoints = array_keys(config("pivot-payment.endpoints"));
        if(!empty($endpoint) && !in_array($endpoint, $endpoints)) {
            throw new \Exception('Invalid endpoint provided: ' . $endpoint);
            return false;
        }
        $baseUrl = config('pivot-payment.environment.staging.url');
        if (config('pivot-payment.is_production')) {
            $baseUrl = config('pivot-payment.environment.production.url');
        }
        $path = config("pivot-payment.endpoints.{$endpoint}.url", '');
        return rtrim($baseUrl, '/') . '/' . ltrim($path, '/');
    }

    public function getMethod($endpoint = null) {
        $endpoints = array_keys(config("pivot-payment.endpoints"));
        if(!empty($endpoint) && !in_array($endpoint, $endpoints)) {
            throw new \Exception('Invalid endpoint provided: ' . $endpoint);
            return false;
        }
        $path = strtolower(config("pivot-payment.endpoints.{$endpoint}.method", 'get'));
        return $path;
    }

    public function getAccessToken() {
        $token = cache()->get('pivot_payment_access_token');
        if (empty($token)) {
            $this->authorize();
            $token = cache()->get('pivot_payment_access_token');
        }
        return $token;
    }

    private function formatUrl($url, array $params) {
        $placeholders = [];
        foreach ($params as $key => $value) {
            $placeholders['{' . $key . '}'] = $value;
        }
        return strtr($url, $placeholders);
    }

    public function access($endpoint, $payload = [], $headers = ['Content-Type' => 'application/json'], $url_parameters = []) {
        $url = $this->getPath($endpoint);
        if (!empty($url_parameters)) {
            $url = $this->formatUrl($url, $url_parameters);
            if (strpos($url, '{')) {
                throw new \Exception('Incomplete url');
            }
        }
        //dd($url, $payload);
        $method = $this->getMethod($endpoint);
        $token = $this->getAccessToken();
        
        $response = Http::withToken($token)->withHeaders($headers)->{$method}($url, $payload);
        // dd($response);
        if (!$response->successful()) {
            dd($url, $payload, $headers, $response->body());
        }
        //dd($url, $payload, $headers, $response->body());
        $result = $this->handleResponse($response);

        return $result;
    }

    public function generateRandomString($length = 16, $lowercase = true, $uppercase = true, $numbers = true, $symbols = false) {
        $characters = '';
        if ($lowercase) { $characters .= 'abcdefghijklmnopqrstuvwxyz'; }
        if ($uppercase) { $characters .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
        if ($numbers) { $characters .= '0123456789'; }
        if ($symbols) { $characters .= '!@#$%^&*()-_=+[]{}|;:,.<>?'; }   
        $random = '';
        for ($i = 0; $i < $length; $i++) {
            $random .= $characters[random_int(0, strlen($characters) - 1)];
        }
        return $random;
    }

    public function generateRequestPagination($current_page = 1) {
        $per_page = config('pivot-payment.pagination_per_page');
        if ($per_page > 100) { $per_page = 100; } //as spec, max 100 per page
        if ($per_page < 1) { $per_page = 20; } //as spec, min 1 per page
        if ($current_page < 1) { $current_page = 1; } //as spec, min 1 page

        return [
            'page' => $current_page,
            'perPage' => $per_page
        ];
    }

    public function mapMethod($form_method) {
        switch($form_method) {
            case 'QRIS': return 'QR';
            default: return $form_method;
        }
    }

    public function getPaymentExpiryDate() {
        return now()->addMinutes(config('pivot-payment.payment_expiration'))->toIso8601String();
    }

    public function generatePaymentConfirmationData(Payment $payment, Array $data = []):Array {
        $payment_data = json_decode($payment->data, 1);
        $method = $payment_data['response']['paymentMethod']['type'];
        $result = [
            'paymentMethod' => [
                'type' => $method
            ],
            'paymentMethodOptions' => []
        ];

        switch($method) {
            case 'VIRTUAL_ACCOUNT':
                //validate
                if (empty($data['provider'])) {
                    throw new \Exception('Missing required data');
                }

                $result['paymentMethodOptions']['virtualAccount'] = [
                    'channel' => $data['provider'],
                    "virtualAccountName" => $data['name'] ?? null
                ];
                break;
            case 'CARD':
                //validate
                if (empty($data['encrypted_data'])) {
                throw new \Exception('Missing required data');
                }

                $result['paymentMethod']['card'] = [
                    'encryptedCard' => $data['encrypted_data']
                ];
                $result['paymentMethodOptions']['card'] = [
                    'captureMethod' => 'automatic',
                    'threeDsMethod' => 'CHALLENGE',
                    'processingConfig' => [
                        'bankMerchantId' => null,
                        'merchantIdTag' => null,
                    ],
                ];
                break;
        }

        return $result;
    }

    public function generatePaymentSessionData($method, User $user, Transaction $transaction, $provider = null) {
        //assuming the transaction is also include payment, installment, item, and program data
        //assuming transaction has not paid yet and has no unpaid payment

        if (empty($transaction->transactionItem) || empty($transaction->transactionItem->program)) {
            throw new \Exception('Transaction item or program not found');
        }

        //determine amount and installment index
        $amount = (float) $transaction->total_left_amount;
        $installment_index = 1;
        if (!empty($transaction->installment)) {
            $amount = Installment::calculateNextInstallment($transaction);
        }

        $amount = (float)$amount;

        //payment session data
        $result = [
            'clientReferenceId' => null,
            'amount' => [
                'value' => (int) ceil($amount),
                'currency' => 'IDR'
            ],
            'paymentType' => 'SINGLE',
            'paymentMethod' => [
                'type' => $method
            ],
            'mode' => 'API',
            'redirectUrl' => [
                "successReturnUrl" => "https://staging.cms.wiwitan.62dev.com/api/v1/pg/pivot/success",
                "failureReturnUrl" => "https://staging.cms.wiwitan.62dev.com/api/v1/pg/pivot/fail",
                "expirationReturnUrl" => "https://staging.cms.wiwitan.62dev.com/api/v1/pg/pivot/expired"
            ],
            'autoConfirm' => $method === 'CARD' ? false : true,
            'statementDescriptor' => config('pivot-payment.descriptor'),
            'expiryAt' => null,
            'metaData' => [
                'invoiceNo' => $transaction->number
            ],
        ];

        if ($method === 'VIRTUAL_ACCOUNT') {
            $result['paymentMethodOptions'] = [
                'virtualAccount' => [
                    'channel' => $provider
                ]
            ];
        }
        if ($method === 'CARD') {
            $result['paymentMethodOptions'] = [
                'card' => [
                    'captureMethod' => 'automatic',
                    'threeDsMethod' => 'CHALLENGE'
                ]
            ];
        }

        //add customer and order information
        $result['customer'] = $this->generateCustomerData($user, true, false);
        $transaction->loadMissing(['transactionItem.program']);
        $result['orderInformation'] = $this->generateOrderData(
            $user,
            $transaction->transactionItem->program->title,
            $transaction->price_type,
            $amount,
            !empty($transaction->installment) ? PaymentTypeConstant::INSTALLMENT : PaymentTypeConstant::FULL,
            $installment_index
        );

        return $result;
    }

    public function generateCustomerData(User $user, $with_refund_preferences = false, $with_address = false, $with_shipping = false) {
        //extract name
        $name = explode(' ', $user->name);
        $last_name = array_pop($name);
        $first_name = is_array($name) ? implode(' ', $name) : $name;

        //extract phone number
        $code = '+62';
        $phone = null;
        if (!empty($user->phone)) {
            $phone = preg_replace('/\s+/','', $user->phone);
            if (str_starts_with($phone, '0')) { $phone = substr($phone, 1); }
            if (str_starts_with($phone, '+')) { 
                $phone = substr($phone, 1); 
                for($i = 3; $i >= 1; $i--) {
                    if (in_array(substr($phone, 0, $i), $this->phone_country_codes)) {
                        $code = '+' . substr($phone, 0, $i);
                        $phone = substr($phone, $i);
                        break;
                    }
                }
            }
            if (empty($phone)) {
                $phone = $user->phone;
            }
        }

        $result = [
            'givenName' => $first_name,
            'sureName' => $last_name,
            'email' => $user->email,
            'phoneNumber' => [
                'countryCode' => $code,
                'number' => $phone,
            ]
        ];
        if ($with_refund_preferences) {
            $result['refundPreference'] = [
                'method' => 'AUTO',
                // "transferDestination" => [
                //     "channelCode" => null,
                //     "channelInformation" => [
                //         "accountNumber" => null,
                //         "accountName" => null
                //     ]
                // ]
            ];
        }
        $city = Cities::find($user->city_id)->with(['province'])->first();
        if ($with_address) {
            $addresses = str_split($user->address, 250);
            $result['addressLine1'] = $addresses[0] ?? null;
            $result['addressLine2'] = $addresses[1] ?? null;
            $result['city'] = $city->name ?? null;
            $result['provinceState'] = $city->province->name ?? null;
            $result['country'] = 'ID';
            $result['postalCode'] = null;
        }
        if ($with_shipping) {
            $result['method'] = null;
            // $result['shippingFee'] = [
            //     'value' => null,
            //     'currency' => null
            // ];
        }
        return $result;
    }

    public function generateOrderData(User $user, $program_name, $price_type, $value, $payment_type, $installment_index = 1) {
        //define name & description
        $name = 'Kelas ' . $program_name;
        $description = 'Pembayaran ';
        if ($price_type == PriceTypeConstant::ADMINSTRATION) {
            $description .= 'Administrasi';
        } else if ($price_type == PriceTypeConstant::TRAINING) {
            $description .= 'Kelas';
        }
        if ($payment_type == PaymentTypeConstant::INSTALLMENT) {
            $description .= ": Cicilan ke-" . $installment_index;
        } else if ($payment_type == PaymentTypeConstant::FULL) {
            $description .= ": Pembayaran Penuh";
        } 

        $result = [
            'productDetails' => [[
                'type' => "SERVICE",
                'category' => "Education",
                'subCategory' => 'Vocational Training Center',
                'name' => $name,
                'description' => $description,
                'quantity' => 1,
                'price' => [
                    'value' => $value,
                    'currency' => 'IDR'
                ]
            ]]
        ];
        //$result['billingInfo'] = $this->generateCustomerData($user, false, true);
        //$result['shippingInfo'] = $this->generateCustomerData($user, false, true, true);

        return $result;   
    }

    public function authorize() {
        $url = $this->getPath('auth');
        $payload = ['grantType' => 'client_credentials'];
        $response = Http::withHeaders([
            'X-MERCHANT-ID' => config('pivot-payment.client_id'),
            'X-MERCHANT-SECRET' => config('pivot-payment.secret_key'),
            'Content-Type' => 'application/json',
        ])->post($url, $payload);

        $result = $this->handleResponse($response);
        $token = $result['data']['accessToken'] ?? null;
        if (empty($token)) {
            throw new \Exception('Failed to retrieve access token');
        }
        $expire_at = now()->addSeconds($response->json()['expiresIn'] ?? config("pivot-payment.timeout"));
        cache()->put('pivot_payment_access_token', $token, $expire_at);
        
        return true;
    }
}