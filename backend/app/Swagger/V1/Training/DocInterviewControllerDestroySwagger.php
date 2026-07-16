<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Delete(
 * path="/training/interviews/{id}",
 * tags={"Training - interviews"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_ids"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 */

class DocInterviewControllerDestroySwagger
{
}
