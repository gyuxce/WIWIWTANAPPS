<?php

namespace App\Swagger\V1\Forum\CMS;

/**
 *
 * @OA\Get(
 * path="/cms/forum/reports/{id}",
 * tags={"CMS Forum - reports"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ForumReport Model", @OA\JsonContent()),
 * )
 */

class DocForumReportControllerShowSwagger
{
}
