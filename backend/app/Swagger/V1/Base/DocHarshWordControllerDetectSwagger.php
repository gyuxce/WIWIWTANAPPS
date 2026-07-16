<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Post(
 * path="/base/harsh-words/detect",
 * tags={"Base - harsh words"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *  @OA\Property(
 *          property="sentence",
 *      ),
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return boolean", @OA\JsonContent()),
 * )
 */

class DocHarshWordControllerDetectSwagger
{
}
