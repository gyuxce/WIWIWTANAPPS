<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Get(
 * path="/training/student-report/{id}",
 * tags={"Training - student report"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Course Model", @OA\JsonContent()),
 * )
 */

class DocStudentReportConstollerShowSwagger
{
}
