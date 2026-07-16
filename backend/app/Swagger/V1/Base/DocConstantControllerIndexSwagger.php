<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Get(
 * path="/constants",
 * tags={"Base - constants"},
 * @OA\Parameter(ref="#/components/parameters/OA_listConstant"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Constant Data", @OA\JsonContent()),
 * )
 */

class DocConstantControllerIndexSwagger
{
}
