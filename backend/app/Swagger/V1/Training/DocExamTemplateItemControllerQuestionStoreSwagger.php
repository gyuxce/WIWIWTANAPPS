<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Post(
 * path="/training/exam-template-items/question",
 * tags={"Training - exam_template_items"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="sesi_question_id", type="string", example="uuid"),
 *             @OA\Property(property="description", type="string", example="description"),
 *             @OA\Property(property="body_file_id", type="string", example="body_file_id"),
 *             @OA\Property(
 *                 property="questions",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                      @OA\Property(property="title", type="string", example="Title"),
 *                      @OA\Property(property="description", type="string", example="Description"),
 *                      @OA\Property(property="type", type="integer",example=1),
 *                      @OA\Property(property="body_type", type="string", example=""),
 *                      @OA\Property(property="body_url", type="string", example=""),
 *                      @OA\Property(property="body_file_id", type="integer",example=1),
 *                      @OA\Property(property="weight_true", type="integer",example=1),
 *                      @OA\Property(property="weight_null", type="integer",example=1),
 *                      @OA\Property(property="weight_false", type="integer",example=1),
 *                      @OA\Property(property="weight_min", type="integer",example=1),
 *                      @OA\Property(property="weight_max", type="integer",example=1),
 *                      @OA\Property(property="index", type="integer",example=1),
 *                     @OA\Property(
 *                         property="data",
 *                         type="object",
 *                         @OA\Property(property="description", type="string", example="Description"),
 *                         @OA\Property(property="url", type="string", example="url"),
 *                     ),
 *                      @OA\Property(
 *                          property="question_items",
 *                          type="array",
 *                          @OA\Items(
 *                              type="object",
 *                              @OA\Property(property="description", type="string", example="Description"),
 *                              @OA\Property(property="is_correct", type="integer", example=1),
 *                              @OA\Property(property="weight", type="integer", example=1),
 *
 *                              ),
 *                          ),
 *                 ),
 *             ),
 *         ),
 *     ),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */

class DocExamTemplateItemControllerQuestionStoreSwagger
{
}
