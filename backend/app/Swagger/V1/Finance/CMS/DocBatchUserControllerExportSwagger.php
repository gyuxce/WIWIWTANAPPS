<?php

namespace App\Swagger\V1\Finance\CMS;

/**
 *
 * @OA\Get(
 * path="/cms/finance/batch-users/export",
 * tags={"Finance - batch_users"},
 * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
 * @OA\Parameter(ref="#/components/parameters/OA_options"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 */

class DocBatchUserControllerExportSwagger
{
}
