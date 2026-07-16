<?php

namespace App\Swagger\V1\Forum\Mobile;

/**
 *
 * @OA\Get(
 * path="/mobile/forum/reports/{id}",
 * tags={"Mobile Forum - reports"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ForumReport Model", @OA\JsonContent()),
 * )
 */

class DocForumReportControllerShowSwagger
{
}
