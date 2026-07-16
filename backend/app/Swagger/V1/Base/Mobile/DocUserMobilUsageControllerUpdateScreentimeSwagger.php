<?php

namespace App\Swagger\V1\Base\Mobile;

/**
 *
 * @OA\Post(
 * path="/mobile/base/users/screentime-usage",
 * tags={"Mobile Base - users"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="screentime_usage",
 *      ),
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return User Model", @OA\JsonContent()),
 * )
 */

class DocUserMobilUsageControllerUpdateScreentimeSwagger
{
}
