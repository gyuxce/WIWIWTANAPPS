<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Get(
 * path="/base/users/{id}",
 * tags={"Base - users"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return User Model", @OA\JsonContent()),
 * )
 */

class DocUserControllerShowSwagger
{

}