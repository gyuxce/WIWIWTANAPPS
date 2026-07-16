<?php

namespace App\Swagger\V1\Training\Mobile;

/**
 * @OA\Get(
 *     path="/mobile/training/module/materi/assesment/question/{module_id}",
 *     tags={"Mobile Training - module"},
 *     @OA\Parameter(
 *         name="module_id",
 *         in="path",
 *         required=true,
 *         description="Ambil dari parentnya yg paling atas itu loh ke array assesment [ nah ambil idi dari sini]",
 *         @OA\Schema(type="string")
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="Return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */


class DocModukeContentAssesmentQuestionControllerSwaager
{
}
