<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Put(
 * path="/base/user-files/{id}",
 * tags={"Base - user files"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *           property="description",
 *      ),
 *      @OA\Property(
 *          property="slug",
 *      ),
 *      @OA\Property(
 *          property="type"
 *      ),
 *      @OA\Property(
 *          property="user_id",
 *      ),
 *      @OA\Property(
 *          property="file_id",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return User Model", @OA\JsonContent()),
 * )
 */

class DocUserFilesControllerUpdateSwagger
{
}
