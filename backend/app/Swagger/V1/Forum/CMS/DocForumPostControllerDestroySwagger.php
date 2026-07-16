<?php

namespace App\Swagger\V1\Forum\CMS;

/**
 *
 * @OA\Post(
 * path="/cms/forum/posts/{id}",
 * tags={"CMS Forum - posts"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="deleted_reason",
 *      ),
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_ids"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 */

class DocForumPostControllerDestroySwagger
{
}
