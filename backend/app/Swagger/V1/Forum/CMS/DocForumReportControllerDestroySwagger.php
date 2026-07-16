<?php

namespace App\Swagger\V1\Forum\CMS;

/**
 *
 * @OA\Delete(
 * path="/cms/forum/reports/{id}",
 * tags={"CMS Forum - reports"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_ids"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 */

class DocForumReportControllerDestroySwagger
{
}
