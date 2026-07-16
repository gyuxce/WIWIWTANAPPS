<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Get(
 * path="/training/user-exams/export",
 * tags={"Training - user_exams"},
 * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
 *   @OA\Parameter(
 *     in="query",
 *     name="type_pratest",
 *     description="Type of list",
 *     schema={"type": "string", "enum": {"language", "character", "qna"}}
 * ),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Parameter(ref="#/components/parameters/OA_options"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 */

class DocUserExamControllerExportSwagger
{
}
