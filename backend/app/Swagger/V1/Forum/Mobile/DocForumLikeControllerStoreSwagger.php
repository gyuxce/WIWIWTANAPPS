<?php

namespace App\Swagger\V1\Forum\Mobile;

/**
 *
 * @OA\Post(
 * path="/mobile/forum/likes",
 * tags={"Mobile Forum - likes"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="description",
 *      ),
 *      @OA\Property(
 *          property="post_id",
 *      ),
 *      @OA\Property(
 *          property="comment_id",
 *      ),
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ForumLike Model", @OA\JsonContent()),
 * )
 */

class DocForumLikeControllerStoreSwagger
{
}
