<?php

namespace App\Swagger\V1\Training\Mobile;

/**
 *
 * @OA\Get(
 * path="/mobile/training/user-exams/schedule/{user_exam_id}",
 * tags={"Mobile Training - user_exams"},
 * @OA\Parameter(
 *         name="user_exam_id",
 *         in="path",
 *         required=true,
 *         description="User exam id",
 *         @OA\Schema(type="string")
 *  ),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ForumPost Model", @OA\JsonContent()),
 * )
 */

class DocUserExamGetScheduleMobileControllerSwagger
{
}
