<?php

namespace SardineMicroservice\Swagger\V1;

/**
 *
 *
 *  @OA\Post(
 * path="/files",
 * tags={"Files"},
 * @OA\RequestBody( @OA\MediaType( mediaType="multipart/form-data", @OA\Schema(
 *      @OA\Property(property="file", type="string", format="binary"),
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return success true", @OA\JsonContent()),
 * )
 * 
 *
 * @OA\Get(
 * path="/files/{id}",
 * tags={"Files"},
 * description="use this get file if you using local storage",
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return success true", @OA\JsonContent()),
 * )
 */

class FilesControllerSwagger
{
}