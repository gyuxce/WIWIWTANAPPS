<?php

namespace App\Swagger\V1\Forum\Mobile;

/**
 *
 * @OA\Post(
 * path="/mobile/forum/reports",
 * tags={"Mobile Forum - reports"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="notes",
 *      ),
 *      @OA\Property(
 *          property="post_id",
 *      ),
 *      @OA\Property(
 *          property="comment_id",
 *      ),
 *      @OA\Property(
 *          property="status",
 *      ),
 *      @OA\Property(
 *          property="type",
 *      ),
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ForumReport Model", @OA\JsonContent()),
 * )
 */

class DocForumReportControllerStoreSwagger
{
}
