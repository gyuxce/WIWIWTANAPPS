<?php

namespace App\Http\Controllers\Api\V1\Dolphin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Dolphin\ApiForgotPasswordRequest;
use App\Http\Requests\Api\V1\Dolphin\ApiResetPasswordRequest;
use App\Http\Requests\Api\V1\Dolphin\ApiChangePasswordRequest;
use App\Models\Base\User;
use App\Models\Base\Otp;
use App\Services\Dolphin\Dolphin;
use App\Services\Sailfish\Sailfish;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PasswordController extends Controller
{
    public $forgotPasswordValidator = ApiForgotPasswordRequest::class;
    public $resetPasswordValidator = ApiResetPasswordRequest::class;
    public $changePasswordValidator = ApiChangePasswordRequest::class;

    private $dolphin;
    private $sailfish;

    public function __construct()
    {
        $this->dolphin = new Dolphin();
        $this->sailfish = new Sailfish();
    }

    /**
     * Handle forgot password request and send an email to reset it
     *
     * @return JsonResponse
     */
    public function forgotPassword(): JsonResponse
    {
        $req = app($this->forgotPasswordValidator);
        $user = User::getFirst($req->input('email'), 'email');
        if (empty($user->email)) {
            abort(404, __('messages.email_not_registered'));
        }

        if($req->get('is_mobile') == 1) {
            // check user mobile
            if($user->role_id != null) {
                return response()->json([
                    "status" => "fail",
                    "message" => __('messages.unauthorized')
                ], 401);
            }
        } else {
            // check admin cms
            if($user->role_id == null) {
                return response()->json([
                    "status" => "fail",
                    "message" => __('messages.unauthorized')
                ], 401);
            }
        }

        $body = [
            'redirect_url' => $req->input('redirect_url'),
            'method' => 'email',
            'receiver' => $user->email,
            'expires_at' => Carbon::now()->addHour(),
        ];

        $data = $this->dolphin->forgotPassword($body);
        $token = $data->original['data'];

        $bodySailfish = [
            'type' => 'email',
            'recipient' => $user->email,
            "recipient_name" => $user->name,
            'title' => 'Reset Password - Wiwitan',
            'body' => "reset password",
            'template' => 'email_forgot_password.html',
            'template_params' => [
                'name' => $user->name,
                'subject' => 'Reset Password - Wiwitan',
                'url' => $req->input('redirect_url') . '/' . $token["reset_token"]
            ]
        ];

        $sailfish = $this->sailfish->push($bodySailfish);

        return response()->json([
            'status' => 'success',
            'message' => $sailfish->original['message'],
            'token' => $data->original['data'],
            'sailfish' => $sailfish->original,
        ], Response::HTTP_OK);
    }

    public function resetPassword($token)
    {
        $req = app($this->resetPasswordValidator);
        $decodePasswordToken = base64_decode($token);
        $splitToken = explode("#", $decodePasswordToken);

        $verifyToken = Otp::where('type', $splitToken[0])->where('code', $splitToken[1])->where('receiver', $splitToken[2])->first();
        if ($verifyToken) {
            $user = User::where('email', $splitToken[2])->first();

            //skip these
            // if($req->get('is_mobile') == 1) {
            //     // check user mobile
            //     if($user->role_id != null) {
            //         return response()->json([
            //             "status" => "fail",
            //             "message" => __('messages.unauthorized')
            //         ], 401);
            //     }
            // } else {
            //     // check admin cms
            //     if($user->role_id == null) {
            //         return response()->json([
            //             "status" => "fail",
            //             "message" => __('messages.unauthorized')
            //         ], 401);
            //     }
            // }

            if (Hash::check($req->input('password'), $user->password)) {
                return response()->json([
                    "status" => "error",
                    "message" => __('messages.error_reset_password'),
                ], 422);
            }
        }
        
        $body = [
            'password' => $req->input('password'),
            'confirm_password' => $req->input('password_confirmation')
        ];

        $res = $this->dolphin->resetPassword($body, $token);
        $data = json_decode($res->content(), true);

        if ($data['status'] == "success") {
            return response()->json([
                "status" => "success",
                "message" => __('messages.success_reset_password'),
            ], 200);
        } else {
            if ($data['message'] == "expired otp") {
                return response()->json([
                    "status" => "error",
                    "message" => __('messages.expired_reset_password'),
                ], 401);
            }
        }

        return $res;
    }

    public function changePassword()
    {
        $req = app($this->changePasswordValidator);

        $user = User::where('id', Auth::id())->first();

        if (Hash::check($req->input('password'), $user->password)) {
            return response()->json([
                "status" => "error",
                "message" => __('messages.error_reset_password'),
            ], 422);
        }

        $user->update([
            'password' => Hash::make($req->input('password')),
            "password_updated_at" => now(),
        ]);

        return response()->json([
            "status" => "success",
            "message" => __('messages.success_reset_password'),
        ], 200);
    }

    public function userChangePassword()
    {
        $req = app($this->changePasswordValidator);

        $user = User::where('id', Auth::id())->first();

        if (!Hash::check($req->input('old_password'), $user->password)) {
            return response()->json([
                "status" => "error",
                "message" => "Kata sandi lama anda berbeda, silahkan coba lagi",
            ], 401);
        } else {
            if (Hash::check($req->input('password'), $user->password)) {
                return response()->json([
                    "status" => "error",
                    "message" => __('messages.error_reset_password'),
                ], 422);
            }
            $user->update([
                'password' => Hash::make($req->input('password')),
                "password_updated_at" => now(),
            ]);
        }

        return response()->json([
            "status" => "success",
            "message" => __('messages.success_reset_password'),
        ], 200);
    }
}