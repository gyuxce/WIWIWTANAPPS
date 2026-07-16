<?php

namespace App\Swagger\V1\Base\Mobile;

/**
 *
 * @OA\Get(
 * path="/mobile/base/users/user-files/download/{file_id}",
 * tags={"Mobile Base - users"},
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

class DocUserFilesMobileControllerDownloadSwagger
{
}
