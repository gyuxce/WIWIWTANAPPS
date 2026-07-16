<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Delete(
 * path="/base/users/{id}",
 * tags={"Base - users"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_ids"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 */

class DocUserControllerDestroySwagger
{

}