<?php

namespace App\Swagger\V1\Training\Mobile;

/**
 * @OA\Post(
 *     path="/mobile/training/user-exams/set-status",
 *     tags={"Mobile Training - user_exams"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="user_exam_id", type="string", example="1e49e5bf-0e2c-41c5-9fd4-8cce12d91683"),
 *             @OA\Property(property="status", type="integer", example="1"),
 *             @OA\Property(property="finished_at", type="date", example="2024-01-01 10:00:00"),
 *             @OA\Property(property="started_at", type="date", example="2024-01-01 10:00:00"),
 *         ),
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="Return user exams Model", @OA\JsonContent()),
 * )
 */


class DocUserExamSetStatusLanguageControllerSwaager
{
}
