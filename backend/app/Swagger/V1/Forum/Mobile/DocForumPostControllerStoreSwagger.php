<?php

namespace App\Swagger\V1\Forum\Mobile;

/**
 *
 * @OA\Post(
 * path="/mobile/forum/posts",
 * tags={"Mobile Forum - posts"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="title",
 *      ),
 *      @OA\Property(
 *          property="description",
 *      ),
 *      @OA\Property(
 *          property="user_id",
 *      ),
 *      @OA\Property(
 *          property="topic_id",
 *      ),
 *      @OA\Property(
 *          property="is_draft",
 *      ),
 *      @OA\Property(
 *          property="is_publish",
 *      ),
 *      @OA\Property(
 *          property="status",
 *      ),
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ForumPost Model", @OA\JsonContent()),
 * )
 */

class DocForumPostControllerStoreSwagger
{
}
