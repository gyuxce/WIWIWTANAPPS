<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Get(
 * path="/base/user-files/download/{file_id}",
 * tags={"Base - user files"},
 * @OA\Parameter(
 *      name="file_id",
 *      in="path",
 *      required=true,
 *      @OA\Schema(type="string"),
 * ),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 */

class DocUserFilesControllerDownloadSwagger
{
}
