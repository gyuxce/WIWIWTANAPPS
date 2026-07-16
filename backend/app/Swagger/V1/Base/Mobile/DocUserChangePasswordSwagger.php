<?php

namespace App\Swagger\V1\Base\Mobile;

/**
 *
 * @OA\Post(
 * path="/mobile/base/users/change-password",
 * tags={"Mobile Base - users"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="old_password",
 *      ),
 *      @OA\Property(
 *          property="password",
 *      ),
 *      @OA\Property(
 *          property="password_confirmation",
 *      )
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 */

class DocUserChangePasswordSwagger
{
}
