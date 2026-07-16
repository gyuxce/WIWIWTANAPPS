<?php

namespace App\Swagger\V1\Forum\Mobile;

/**
 *
 * @OA\Delete(
 * path="/mobile/forum/posts/{id}",
 * tags={"Mobile Forum - posts"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_ids"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 */

class DocForumPostControllerDestroySwagger
{
}
