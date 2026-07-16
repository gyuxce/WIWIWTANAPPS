<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Get(
 * path="/training/courses/export",
 * tags={"Training - courses"},
 * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
 * @OA\Parameter(ref="#/components/parameters/OA_options"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 */

class DocCourseControllerExportSwagger
{
}
