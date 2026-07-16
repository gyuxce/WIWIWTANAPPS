<?php

namespace App\Swagger\V1\Training;

/**
 * @OA\Post(
 *     path="/training/student-report/update-report",
 *     tags={"Training - student report"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *        @OA\Property(
 *          property="id", example="82a1763f-c6b4-4aaa-9fff-84da40de87f4",
 *      ),
 *                 @OA\Property(
 *                     property="question",
 *                     type="array",
 *                     @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="id", type="string", example="0a6af0dd-7e2d-4124-aba2-7b7086338040"),
 *                         @OA\Property(property="a_weight", type="string", example="kalo tipe question yang pilihan ganda kirim id saja"),
 *
 *                     ),
 *                 ),
 *         ),
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */
class DocStudentReportControllerUpdateSwagger
{
}

//new StudentReportControllerUpdate
