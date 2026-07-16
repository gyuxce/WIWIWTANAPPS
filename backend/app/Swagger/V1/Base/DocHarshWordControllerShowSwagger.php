<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Get(
 * path="/base/harsh-words/{id}",
 * tags={"Base - harsh words"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Harsh Words Model", @OA\JsonContent()),
 * )
 */

class DocHarshWordControllerShowSwagger
{
}
