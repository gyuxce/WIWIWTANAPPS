<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Put(
                * path="/training/user-exam-question-items/{id}",
                * tags={"Training - user_exam_question_items"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="user_exam_id",
            *      ),
            *      @OA\Property(
            *          property="question_id",
            *      ),
            *      @OA\Property(
            *          property="is_selected",
            *      ),
            *      @OA\Property(
            *          property="index",
            *      ),
            *      @OA\Property(
            *          property="o_description",
            *      ),
            *      @OA\Property(
            *          property="o_body_type",
            *      ),
            *      @OA\Property(
            *          property="o_body_url",
            *      ),
            *      @OA\Property(
            *          property="o_body_file_id",
            *      ),
            *      @OA\Property(
            *          property="o_is_correct",
            *      ),
            *      @OA\Property(
            *          property="o_weight",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return UserExamQuestionItem Model", @OA\JsonContent()),
                * )
                */
               
class DocUserExamQuestionItemControllerUpdateSwagger  {

}