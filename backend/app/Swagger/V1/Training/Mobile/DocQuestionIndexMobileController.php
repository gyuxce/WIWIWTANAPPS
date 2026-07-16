<?php

namespace App\Swagger\V1\Training\Mobile;

/**
 * @OA\Get(
 *     path="/mobile/training/question/{sesi_question_id}",
 *     tags={"Mobile Training - Question"},
 *     @OA\Parameter(
 *         name="sesi_question_id",
 *         in="path",
 *         required=true,
 *         description="Ambil dati exam template items",
 *         @OA\Schema(type="string")
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="Return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */


class DocQuestionIndexMobileController
{
}
