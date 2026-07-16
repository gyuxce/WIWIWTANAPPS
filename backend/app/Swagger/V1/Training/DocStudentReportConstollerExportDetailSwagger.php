<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Get(
 * path="/training/student-report/detail/export/{id}",
 * tags={"Training - student report"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Course Model", @OA\JsonContent()),
 * )
 */

class DocStudentReportConstollerExportDetailSwagger
{
}
