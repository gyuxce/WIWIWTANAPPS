<?php

namespace App\Swagger\V1\Forum\Mobile;

/**
 *
 * @OA\Get(
 * path="/mobile/forum/comments/{id}",
 * security={{"bearerAuth":{}}},
 * tags={"Mobile Forum - comments"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Response(response=200, description="return ForumComment Model", @OA\JsonContent()),
 * )
 */

class DocForumCommentControllerShowSwagger
{

}