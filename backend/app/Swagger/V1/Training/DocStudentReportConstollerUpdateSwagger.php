<?php

namespace App\Swagger\V1\Training;

/**
 * @OA\Put(
 *     path="/training/student-report/{id}",
 *     tags={"Training - student report"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="id",
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *        @OA\Property(
 *          property="status", example="1,2,3,4 ada di constant",
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
class DocStudentReportConstollerUpdateSwagger
{
}
