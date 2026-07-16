<?php

namespace App\Swagger\V1\Base\Mobile;

/**
 *
 * @OA\Post(
 * path="/mobile/base/users/user-files",
 * tags={"Mobile Base - users"},
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
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return User Model", @OA\JsonContent()),
 * )
 */

class DocUserFilesMobileControllerStoreSwagger
{
}
