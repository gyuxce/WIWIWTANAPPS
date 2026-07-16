<?php

namespace App\Swagger\V1\Training;

/**
            *
            * @OA\Put(
            * path="/training/exam-templates/{id}",
            * tags={"Training - exam_templates"},
            * @OA\Parameter(ref="#/components/parameters/OA_id"),
            * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(  
            *      @OA\Property(
            *          property="title",
            *      ),
            *      @OA\Property(
            *          property="description",
            *      ),
            *      @OA\Property(
            *          property="duration",
            *      ),
            *      @OA\Property(
            *          property="is_randomized_question",
            *      ),
            *      @OA\Property(
            *          property="is_randomized_items",
            *      ),
            *      @OA\Property(
            *          property="retry_count",
            *      ),
            *      @OA\Property(
            *          property="weight_total",
            *      ),
            *      @OA\Property(
            *          property="weight_minimal",
            *      ),
            *      @OA\Property(
            *          property="link_url",
            *      ),
            *      @OA\Property(
            *          property="type",
            *      ),
            *      @OA\Property(
            *          property="is_active",
            *      )
            * ))),
            * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
            * security={{"bearerAuth":{}}},
            * @OA\Response(response=200, description="return ExamTemplate Model", @OA\JsonContent()),
            * )
*/
               
class DocExamTemplateControllerUpdateSwagger  {

}