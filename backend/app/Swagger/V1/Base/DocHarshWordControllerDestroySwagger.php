<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Delete(
 * path="/base/harsh-words/{id}",
 * tags={"Base - harsh words"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_ids"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 */

class DocHarshWordControllerDestroySwagger
{
}
