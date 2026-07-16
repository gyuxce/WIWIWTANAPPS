<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Get(
 * path="/training/interviews/{id}",
 * tags={"Training - interviews"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */

class DocInterviewControllerShowSwagger
{
}
