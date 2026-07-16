<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Get(
 * path="/training/assesment-verbal/{id}/score-minimum",
 * tags={"Training - assesment verbal"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Course Model", @OA\JsonContent()),
 * )
 */

class DocAssementVerbalControllerGetScoreMinSwagger
{
}
