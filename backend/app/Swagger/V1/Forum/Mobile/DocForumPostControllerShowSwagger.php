<?php

namespace App\Swagger\V1\Forum\Mobile;

/**
 *
 * @OA\Get(
 * path="/mobile/forum/posts/{id}",
 * tags={"Mobile Forum - posts"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Response(response=200, description="return ForumPost Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/public/forum/posts/{id}",
 * tags={"Public Forum - posts"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Response(response=200, description="return ForumPost Model", @OA\JsonContent()),
 * )
 */

class DocForumPostControllerShowSwagger
{
}
