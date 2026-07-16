<?php

namespace App\Swagger\V1\Forum\CMS;

/**
 *
 * @OA\Get(
 * path="/cms/forum/comments/{id}",
 * tags={"CMS Forum - comments"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Response(response=200, description="return ForumComment Model", @OA\JsonContent()),
 * )
 */

class DocForumCommentControllerShowSwagger
{

}