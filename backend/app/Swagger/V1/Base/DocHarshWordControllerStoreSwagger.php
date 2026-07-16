<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Post(
 * path="/base/harsh-words",
 * tags={"Base - harsh words"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *  @OA\Property(
 *          property="name",
 *      ),
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Harsh Words Model", @OA\JsonContent()),
 * )
 */

class DocHarshWordControllerStoreSwagger
{
}
