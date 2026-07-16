<?php

namespace App\Swagger\V1\Training;

/**
 * @OA\Post(
 *     path="/training/student-report/update-report-assesment-verbal",
 *     tags={"Training - student report"},
 *     @OA\RequestBody(
 *        @OA\JsonContent(
 *             type="object",
 *        @OA\Property(
 *          property="id", example="82a1763f-c6b4-4aaa-9fff-84da40de87f4",
 *        ),
 *        @OA\Property(
 *          property="score_assesment", example="80",
 *        ),
 *         ),
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */
class DocStudentReportControllerUpdateAssesmentVerbalSwagger
{
}