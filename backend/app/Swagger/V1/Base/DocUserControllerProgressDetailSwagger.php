<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Get(
 * path="/base/users/progress/{id}",
 * tags={"Base - users"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return User Model", @OA\JsonContent()),
 * )
 */

class DocUserControllerProgressDetailSwagger
{
}
