<?php

namespace App\Swagger\V1\Training;

/**
 * @OA\Post(
 *     path="/training/student-report/repeat-assesment-verbal",
 *     tags={"Training - student report"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *              type="object",
 *              @OA\Property(
 *                  property="id", example="82a1763f-c6b4-4aaa-9fff-84da40de87f4",
 *              ),
 *              @OA\Property(
 *                  property="link", example="https://google.com",
 *              ),
 *              @OA\Property(
 *                  property="working_date", example="2023-02-02 17:00:00",
 *              ),  
 *         ),
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */
class DocStudentReportControllerRepeatAssesmentVerbalSwagger
{
}
