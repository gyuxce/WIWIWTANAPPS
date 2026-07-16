<?php

namespace App\Swagger\V1\Forum\CMS;

/**
 *
 * @OA\Post(
 * path="/cms/forum/reports/warn",
 * tags={"CMS Forum - reports"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="id",
 *      ),
 *      @OA\Property(
 *          property="notif_message",
 *      ),
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 */

class DocForumReportWarnControllerSwagger
{
}
