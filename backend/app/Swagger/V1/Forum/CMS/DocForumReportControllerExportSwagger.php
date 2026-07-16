<?php

namespace App\Swagger\V1\Forum\CMS;

/**
 *
 * @OA\Get(
 * path="/cms/forum/reports/export",
 * tags={"CMS Forum - reports"},
 * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
 * @OA\Parameter(ref="#/components/parameters/OA_options"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 */

class DocForumReportControllerExportSwagger
{
}
