<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Post(
 * path="/base/user-files",
 * tags={"Base - user files"},
 * @OA\RequestBody( @OA\MediaType( mediaType="multipart/form-data", @OA\Schema(
 *       @OA\Property(property="file", type="string", format="binary"),
 *      @OA\Property(
 *          property="description",
 *      ),
 *      @OA\Property(
 *          property="slug",
 *      ),
 *      @OA\Property(
 *          property="type"
 *      ),
 *       @OA\Property(
 *          property="user_id"
 *      ),
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return User Model", @OA\JsonContent()),
 * )
 */

class DocUserFilesControllerStoreSwagger
{
}
