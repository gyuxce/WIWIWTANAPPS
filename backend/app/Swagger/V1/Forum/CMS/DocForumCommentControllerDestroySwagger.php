<?php

namespace App\Swagger\V1\Forum\CMS;

/**
 *
 * @OA\Delete(
 * path="/cms/forum/comments/{id}",
 * tags={"CMS Forum - comments"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 */

class DocForumCommentControllerDestroySwagger
{

}