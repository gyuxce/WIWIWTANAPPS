<?php

namespace App\Http\Controllers\Api\V1\Dolphin;

use App\Constants\PhaseSettingConstant;
use App\Constants\SignInProviderFirebaseConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\UserExamStatusConstant;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Dolphin\ApiAuthRefreshTokenRequest;
use App\Http\Requests\Api\V1\Dolphin\ApiForgotPasswordRequest;
use App\Http\Requests\Api\V1\Dolphin\ApiSignInRequest;
use App\Http\Requests\Api\V1\Dolphin\ApiSignUpRequest;
use App\Http\Requests\Api\V1\Dolphin\ApiVerfiyAdapterRequest;
use App\Http\Resources\V1\Base\UserResource;
use App\Models\Base\Token;
use App\Models\Base\User;
use App\Models\Master\Cities;
use App\Models\Training\UserExam;
use App\Services\Dolphin\Dolphin;
use App\Services\Sailfish\Sailfish;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public $signinValidator = ApiSignInRequest::class;
    public $signupValidator = ApiSignUpRequest::class;
    public $verfiyAdapterValidator = ApiVerfiyAdapterRequest::class;
    public $forgotPasswordValidator = ApiForgotPasswordRequest::class;
    public $refreshTokenValidator = ApiAuthRefreshTokenRequest::class;

    private $dolphin;
    private $sailfish;

    public function __construct()
    {
        $this->dolphin = new Dolphin();
        $this->sailfish = new Sailfish();
    }

    public function signIn()
    {
        $req = app($this->signinValidator);

        $res = $this->dolphin->signIn($req->all());
        $data = json_decode($res->content(), true);
        $status = $data['status'] ?? 'success';
        $message = $data['message'] ?? 'success';

        // handle user's login attempts with 3x incorect password
        if ($message == "invalid email or password" && $status == 'error') {
            $user = User::where('email', $req->email)->where('role_id', null)->first();
            $recent_login_attempt = isset($user) ? $user->count_login_attempt + 1 : 0;

            if (isset($user) && $recent_login_attempt == 3) {
                $user->update([
                    'is_active' => false,
                    'count_login_attempt' => $recent_login_attempt
                ]);

                return response()->json([
                    "status" => "fail",
                    "message" => __('messages.error_login_attempt')
                ], 401);
            } else if (isset($user)) {
                $user->update([
                    'count_login_attempt' => $user->count_login_attempt + 1
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => __('messages.invalid_email_password')
            ], 401);
        }

        if ($status == "success") {
            $user = $data['data']['user']['id'] ?? 0;
            \Auth::loginUsingId($user);
            $data['data']['user'] = new UserResource(auth()->user());

            if ($req->get('is_mobile') == 1) {
                // login mobile
                if (auth()->user()->role_id != null) {
                    $request = new Request();
                    $request->merge([
                        "refresh_token" => $data['data']['refresh_token']
                    ]);
                    # disable token from service dolpin
                    $this->dolphin->fetch('POST', '/tokens/block', ['refresh_token' => $data['data']['refresh_token']], 'Bearer ' . $data['data']['access_token']);
                    $this->signOut($request);
                    # disable token from service dolpin

                    return response()->json([
                        "status" => "fail",
                        "message" => __('messages.unauthorized')
                    ], 401);
                }
            } else {
                // login cms
                if (auth()->user()->role_id == null) {
                    $request = new Request();
                    $request->merge([
                        "refresh_token" => $data['data']['refresh_token']
                    ]);
                    # disable token from service dolpin
                    $this->dolphin->fetch('POST', '/tokens/block', ['refresh_token' => $data['data']['refresh_token']], 'Bearer ' . $data['data']['access_token']);
                    $this->signOut($request);
                    # disable token from service dolpin

                    return response()->json([
                        "status" => "fail",
                        "message" => __('messages.unauthorized')
                    ], 401);
                }
            }

            $userData = User::getFirst($user, 'id');
            if ($userData->is_active == false) {
                if ($userData->email_verified_at == null) {
                    $this->reregisterProcess($userData);
                }

                return response()->json([
                    "status" => "fail",
                    "message" => __('messages.account_inactive')
                ], 401);
            }

            // reset login attempt if user successfully login
            $userData->update([
                'count_login_attempt' => 0
            ]);
        }

        return $data;
    }

    public function signUp()
    {
        $req = app($this->signupValidator);

        $user['name'] = $req->input('name');
        $user['name_alias'] = $req->input('name');
        $user['email'] = $req->input('email');
        $user['password'] = Hash::make($req->input('password'));
        $user['phone'] = $req->input('phone');
        $user['address'] = $req->input('address');
        $user['city_id'] = Cities::getId($req->input('city_id'));
        $user['birthplace'] = $req->input('birthplace');
        $user['dob'] = $req->input('dob');
        $user['blood_type'] = $req->input('blood_type');
        $user['ethnic_origin'] = $req->input('ethnic_origin');
        $user['last_education'] = $req->input('last_education');
        $user['study_program'] = $req->input('study_program');
        $user['id_card'] = $req->input('id_card');
        $user['is_training'] = $req->input('is_training');
        $user['training_program'] = $req->input('training_program');
        $user['register_information'] = $req->input('register_information');
        $user['other_register_information'] = $req->input('other_register_information');
        $user['last_phase'] = PhaseSettingConstant::PHASE_PRA_TEST;

        $userData = User::where('email', $req->input('email'))->first();

        if ($userData !== null) {
            return response()->json([
                "status" => "error",
                "message" => "Your email has been already registered or linked to another account. Try to forgot your password."
            ], 200);
        }

        if ($req->input('google_id') || $req->input('facebook_id') || $req->input('apple_id')) {
            // $userData = User::where(function ($query) use ($req) {
            //     $query->where('google_id', $req->input('google_id'))
            //         ->where('facebook_id', $req->input('facebook_id'))
            //         ->where('apple_id', $req->input('apple_id'));
            // })->first();

            // if ($userData) {
            //     $user['is_active'] = true;
            //     $userData->update($user);
            // } else {
            $user['google_id'] = $req->input('google_id');
            $user['facebook_id'] = $req->input('facebook_id');
            $user['apple_id'] = $req->input('apple_id');
            $user['is_active'] = true;

            $userData = $this->registerProcess($user, $req);
            //}
        } else {
            $user['is_active'] = false;
            $userData = $this->registerProcess($user, $req);
        }

        if ($userData) {
            $this->afterRegister($userData);
        }

        $data['data'] = new UserResource($userData);

        return $data;
    }

    protected function registerProcess($user, $req)
    {
        $userData = User::create($user);

        $bodySailfish = [
            'type' => 'email',
            'recipient' => $userData->email,
            "recipient_name" => $userData->name,
            'title' => 'Activate Account - Wiwitan',
            'body' => "activate account",
            'template' => 'email_account_activation.html',
            'template_params' => [
                'name' => $userData->name,
                'subject' => 'Activate Account - Wiwitan',
                'url' => env('APP_URL') . "/auth/user/activate/" . $userData->uuid
            ]
        ];
        $sailfish = $this->sailfish->push($bodySailfish);
        $data['sailfish'] = $sailfish->original['message'];

        return $userData;
    }

    protected function reregisterProcess($user)
    {
        $bodySailfish = [
            'type' => 'email',
            'recipient' => $user->email,
            "recipient_name" => $user->name,
            'title' => 'Please Activate Your Account - Wiwitan',
            'body' => "activate account",
            'template' => 'email_account_activation.html',
            'template_params' => [
                'name' => $user->name,
                'subject' => 'Activate Account - Wiwitan',
                'url' => env('APP_URL') . "/auth/user/activate/" . $user->uuid
            ]
        ];
        $sailfish = $this->sailfish->push($bodySailfish);
        $data['sailfish'] = $sailfish->original['message'];
    }

    protected function afterRegister($userData)
    {

        $data_pratest = [];
        $data_pratest[] = [
            'created_at' => now(),
            'updated_at' => now(),
            'uuid' =>  Str::uuid()->toString(),
            'template_id' => ExamTemplateConstant::PRATEST_LANGUAGE,
            'user_id' => $userData->id,
        ];
        $data_pratest[] = [
            'created_at' => now(),
            'updated_at' => now(),
            'uuid' =>  Str::uuid()->toString(),
            'template_id' =>
            ExamTemplateConstant::PRATEST_CHARACTER,
            'user_id' => $userData->id,
        ];
        $data_pratest[] = [
            'created_at' => now(),
            'updated_at' => now(),
            'uuid' =>  Str::uuid()->toString(),
            'template_id' =>
            ExamTemplateConstant::PRATEST_QNA,
            'user_id' => $userData->id,
        ];
        UserExam::insert($data_pratest);
    }

    public function signOut(Request $req)
    {
        $data = Token::where('refresh_token', $req->input('refresh_token'))->first();

        if ($data == null) {
            return response()->json([
                "status" => "success"
            ]);
        }

        Token::where('user_id', $data->user_id)->forceDelete();

        return response()->json([
            "status" => "success"
        ]);
    }

    public function refreshToken()
    {
        $req = app($this->refreshTokenValidator);

        return $this->dolphin->refreshToken($req->all());
    }

    public function adapterVerify($adapter)
    {
        $req = app($this->verfiyAdapterValidator);

        $res = $this->dolphin->adapterVerify($req->all(), $adapter);
        $data = json_decode($res->content(), true);

        if ($data['status'] == "success") {
            if (isset($data['data']['id'])) { // register user
                $user = User::getFirst($data['data']['id'], 'id');
                $user->update([
                    'uuid' => Str::uuid()->toString(),
                    'email_verified_at' => now(),
                ]);

                return response()->json([
                    "status" => "created",
                    "message" => __('messages.google_account_linked'),
                    "data" => new UserResource($user)
                ], 200);
            }

            if (isset($data['data']['user']['id'])) { // login user
                $user = User::getFirst($data['data']['user']['id'], 'id');
                if (!$user->is_active) {
                    return response()->json([
                        "status" => "fail",
                        "message" => __('messages.account_inactive'),
                        "data" => new UserResource($user)
                    ], 401);
                } else {
                    \Auth::loginUsingId($user);
                }
            }

            $data['data']['user'] = new UserResource($user);
            return $data;
        } else {
            return \Response::json($data, 422);
        }
    }

    public function socialLogin(Request $request)
    {
        $token = $request->input('access_token');
        try {
            $user = null;
            $adapterField = '';

            $verifiedIdToken = Firebase::auth()->verifyIdToken($token);
            $firebaseData = $verifiedIdToken->claims()->get('firebase');
            $userEmail = $verifiedIdToken->claims()->get('email');
            $adapter = $firebaseData["sign_in_provider"];
            $adapter_id = $verifiedIdToken->claims()->get('user_id');

            switch ($adapter) {
                case SignInProviderFirebaseConstant::LIST[1]:
                    $adapterField = 'google_id';
                    break;
                case SignInProviderFirebaseConstant::LIST[2]:
                    $adapterField = 'facebook_id';
                    break;
                case SignInProviderFirebaseConstant::LIST[3]:
                    $adapterField = 'apple_id';
                    break;
                default:
                    return response()->json(['error' => 'Invalid adapter'], 400);
            }

            if ($adapterField) {
                $checkUser = User::where($adapterField, $adapter_id)->first(); // check social account id
                if ($checkUser) {
                    return $this->verifyWithDolphinAndRespond($checkUser, $token, $adapterField);
                } else {
                    $user = User::where('email', $userEmail)->first(); // check social account but the email is registerd, the account id isn't registered
                    // if($user) {
                    //     $user->update([
                    //         $adapterField => $adapter_id,
                    //     ]);
                    //     return $this->verifyWithDolphinAndRespond($user, $token, $adapterField);
                    // }

                    return response()->json([
                        'exist' => false,
                        'message' => "User is not exist",
                        'data' => null,
                    ], Response::HTTP_OK);
                }
            }
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        } catch (\Kreait\Firebase\Exception\Auth\InvalidToken $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        } catch (\Kreait\Firebase\Exception\AuthException $e) {
            error_log("Firebase AuthException: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 401);
        } catch (\Throwable $e) {
            error_log("General Exception: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }

    private function verifyWithDolphinAndRespond($user, $token, $adapterField)
    {
        $adapterName = str_replace('_id', '', $adapterField);
        $body = ['access_token' => $token];
        $res = $this->dolphin->adapterVerify($body, $adapterName);
        $data = json_decode($res->content(), true);
        if ($data['status'] == "success") {
            $data['exist'] = true;
            $data['data']['user'] = new UserResource($user);
            if (empty($user->active_date)) {
                User::where('id', $user->id)->update(["active_date" => Carbon::now()]);
            }
            return $data;
        } else {
            return \Response::json($data, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
