<?php

namespace App\Swagger\V1\Training\Mobile;

/**
 * @OA\Put(
 *     path="/mobile/training/user-exams/schedule/{user_exam_id}",
 *     tags={"Mobile Training - user_exams"},
 *     @OA\Parameter(
 *         name="user_exam_id",
 *         in="path",
 *         required=true,
 *         description="User exam id",
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="user_exam_schedule_id", type="string", example="1e49e5bf-0e2c-41c5-9fd4-8cce12d91683"),
 *         ),
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="Return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */


class DocUserExamSetScheduleMobileControllerSwagger
{
}
