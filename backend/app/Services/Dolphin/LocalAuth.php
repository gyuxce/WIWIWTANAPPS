<?php

namespace App\Services\Dolphin;

use App\Http\Resources\V1\Base\UserResource;
use App\Models\Base\Token;
use App\Models\Base\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LocalAuth
{
    public static function enabled(): bool
    {
        return app()->environment('local');
    }

    public function signIn(Request $request)
    {
        $user = User::where('email', $request->input('email'))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'invalid email or password',
                'data' => null,
            ], 401);
        }

        $issuedAt = Carbon::now();
        $accessExpiresAt = $issuedAt->copy()->addHours(2);
        $refreshExpiresAt = $issuedAt->copy()->addDays(30);

        $token = Token::create([
            'uuid' => (string) Str::uuid(),
            'is_active' => true,
            'is_blocked' => false,
            'user_id' => $user->id,
            'platform_id' => null,
            'refresh_token' => Str::random(80),
            'expires_at' => $refreshExpiresAt,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'success',
            'data' => [
                'access_token' => $this->makeAccessToken($user, $token, $issuedAt, $accessExpiresAt),
                'access_token_expires_at' => $accessExpiresAt->toIso8601String(),
                'refresh_token' => $token->refresh_token,
                'refresh_token_expires_at' => $refreshExpiresAt->toIso8601String(),
                'session_id' => $token->uuid,
                'user' => [
                    'id' => $user->id,
                ],
            ],
        ]);
    }

    public function refresh(string $refreshToken)
    {
        $token = Token::where('refresh_token', $refreshToken)
            ->where('is_blocked', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$token || !$token->user) {
            return response()->json([
                'status' => 'error',
                'message' => __('messages.unauthorized'),
                'data' => null,
            ], 401);
        }

        $issuedAt = Carbon::now();
        $accessExpiresAt = $issuedAt->copy()->addHours(2);

        return response()->json([
            'status' => 'success',
            'message' => 'success',
            'data' => [
                'access_token' => $this->makeAccessToken($token->user, $token, $issuedAt, $accessExpiresAt),
                'access_token_expires_at' => $accessExpiresAt->toIso8601String(),
                'refresh_token' => $token->refresh_token,
                'refresh_token_expires_at' => Carbon::parse($token->expires_at)->toIso8601String(),
                'session_id' => $token->uuid,
                'user' => new UserResource($token->user),
            ],
        ]);
    }

    public function verify(string $accessToken)
    {
        $payload = $this->decodeAccessToken($accessToken);
        if (!$payload) {
            return null;
        }

        $token = Token::where('uuid', $payload['session_id'])
            ->where('user_id', $payload['user_id'])
            ->where('is_blocked', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$token || Carbon::parse($payload['expired_at'])->isPast()) {
            return null;
        }

        return (object) [
            'id' => $payload['session_id'],
            'user_id' => $payload['user_id'],
            'issued_at' => $payload['issued_at'],
            'expired_at' => $payload['expired_at'],
        ];
    }

    private function makeAccessToken(User $user, Token $token, Carbon $issuedAt, Carbon $expiresAt): string
    {
        $payload = [
            'session_id' => $token->uuid,
            'user_id' => $user->id,
            'issued_at' => $issuedAt->toIso8601String(),
            'expired_at' => $expiresAt->toIso8601String(),
        ];

        $encodedPayload = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
        $signature = hash_hmac('sha256', $encodedPayload, config('app.key'));

        return 'local.' . $encodedPayload . '.' . $signature;
    }

    private function decodeAccessToken(string $accessToken): ?array
    {
        $parts = explode('.', $accessToken);
        if (count($parts) !== 3 || $parts[0] !== 'local') {
            return null;
        }

        $expectedSignature = hash_hmac('sha256', $parts[1], config('app.key'));
        if (!hash_equals($expectedSignature, $parts[2])) {
            return null;
        }

        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        if (!is_array($payload) || empty($payload['session_id']) || empty($payload['user_id'])) {
            return null;
        }

        return $payload;
    }
}
