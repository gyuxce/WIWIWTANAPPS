<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Get(
 * path="/training/user-exams/{id}",
 * tags={"Training - user_exams"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Parameter(
 *     in="query",
 *     name="type_pratest",
 *     description="Type of list",
 *     schema={"type": "string", "enum": {"language", "character", "qna"}}
 * ),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return UserExam Model", @OA\JsonContent()),
 * )
 */

class DocUserExamControllerShowSwagger
{
}
