<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Put(
 * path="/base/harsh-words/{id}",
 * tags={"Base - harsh words"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(      
 *      @OA\Property(
 *          property="name",
 *      ),
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Harsh Words Model", @OA\JsonContent()),
 * )
 */

class DocHarshWordControllerUpdateSwagger
{
}
