<?php

namespace App\Swagger\V1\Training\Mobile;

/**
 * @OA\Post(
 *     path="/mobile/training/question",
 *     tags={"Mobile Training - Question"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="user_exam_id", type="string", example="1e49e5bf-0e2c-41c5-9fd4-8cce12d91683"),
 *             @OA\Property(
 *                 property="question",
 *                 type="object",
 *                 @OA\Property(property="id", type="string", example="0acd1a90-db1d-421f-a9ec-434a918e16a1"),
 *                 @OA\Property(property="a_body_type", type="integer", example=1),
 *                 @OA\Property(property="a_body_text", type="string", example="test"),
 *                 @OA\Property(property="a_body_url", type="string", example="test"),
 *                 @OA\Property(property="a_body_file_id", type="integer", example=1),
 *                 @OA\Property(
 *                     property="question_items",
 *                     type="array",
 *                     @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="id", type="string", example="0a6af0dd-7e2d-4124-aba2-7b7086338040"),
 *                         @OA\Property(property="is_selected", type="boolean", example=true),
 *
 *                     ),
 *                     @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="id", type="string", example="251aed47-6ccc-41a7-998f-ebc331227d54"),
 *                         @OA\Property(property="is_selected", type="boolean", example=false),
 *
 *                     ),
 *                     @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="id", type="string", example="f76bed9c-7213-4d17-a0ee-08ea9d4ab785"),
 *                         @OA\Property(property="is_selected", type="boolean", example=false),
 *
 *                     ),
 *                      @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="id", type="string", example="f76bed9c-7213-4d17-a0ee-08ea9d4ab785"),
 *                         @OA\Property(property="is_selected", type="boolean", example=false),
 *
 *                     ),
 *                 ),
 *             ),
 *         ),
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */
class DocQuestionAddAnswareMobileController
{

}
