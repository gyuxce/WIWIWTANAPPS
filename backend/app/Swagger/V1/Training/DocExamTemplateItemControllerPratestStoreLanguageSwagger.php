<?php

namespace App\Swagger\V1\Training;

/**
*
* @OA\Post(
* path="/training/exam-template-items/pratest/language",
* tags={"Training - exam_template_items"},
*     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="pratest",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                      @OA\Property(property="title", type="string", example="Title"),
 *                      @OA\Property(property="description", type="string", example="Description"),
 *                      @OA\Property(
 *                          property="child",
 *                          type="array",
 *                          @OA\Items(
 *                              type="object",
 *                               @OA\Property(property="title", type="string", example="Title"),
 *                               @OA\Property(property="description", type="string", example="Description"),
 *                               @OA\Property(property="language_type", type="integer", example=1),
 *
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

class DocExamTemplateItemControllerPratestStoreLanguageSwagger  {

}
