<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Post(
                * path="/training/question-items",
                * tags={"Training - question_items"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="question_id",
            *      ),
            *      @OA\Property(
            *          property="description",
            *      ),
            *      @OA\Property(
            *          property="is_correct",
            *      ),
            *      @OA\Property(
            *          property="body_type",
            *      ),
            *      @OA\Property(
            *          property="body_url",
            *      ),
            *      @OA\Property(
            *          property="body_file_id",
            *      ),
            *      @OA\Property(
            *          property="index",
            *      ),
            *      @OA\Property(
            *          property="weight",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return QuestionItem Model", @OA\JsonContent()),
                * )
                */
               
class DocQuestionItemControllerStoreSwagger  {

}