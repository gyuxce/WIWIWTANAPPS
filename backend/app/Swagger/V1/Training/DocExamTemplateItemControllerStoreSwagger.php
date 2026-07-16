<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Post(
 * path="/training/exam-template-items",
 * tags={"Training - exam_template_items"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(

 *      @OA\Property(
 *          property="template_id",
 *      ),
 *      @OA\Property(
 *          property="question_id",
 *      ),
 *      @OA\Property(
 *          property="index",
 *      ),
 *      @OA\Property(
 *          property="is_header",
 *      ),
 *      @OA\Property(
 *          property="parent_id",
 *      ),
 *      @OA\Property(
 *          property="title",
 *      ),
 *      @OA\Property(
 *          property="description",
 *      ),
 *      @OA\Property(
 *          property="body_type",
 *      ),
 *      @OA\Property(
 *          property="body_url",
 *      ),
 *      @OA\Property(
 *          property="course_item_id",
 *      ),
 *      @OA\Property(
 *          property="body_file_id",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */

class DocExamTemplateItemControllerStoreSwagger
{
}
