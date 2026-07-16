<?php

namespace App\Swagger\V1\Forum\Mobile;

/**
 *
 * @OA\Delete(
 * path="/mobile/forum/comments/{id}",
 * tags={"Mobile Forum - comments"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 */

class DocForumCommentControllerDestroySwagger
{

}