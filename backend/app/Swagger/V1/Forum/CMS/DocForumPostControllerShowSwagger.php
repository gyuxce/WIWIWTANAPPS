<?php

namespace App\Swagger\V1\Forum\CMS;

/**
 *
 * @OA\Get(
 * path="/cms/forum/posts/{id}",
 * tags={"CMS Forum - posts"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ForumPost Model", @OA\JsonContent()),
 * )
 */

class DocForumPostControllerShowSwagger
{
}
