<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Post(
                * path="/training/user-exam-questions",
                * tags={"Training - user_exam_questions"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="user_exam_id",
            *      ),
            *      @OA\Property(
            *          property="question_id",
            *      ),
            *      @OA\Property(
            *          property="index",
            *      ),
            *      @OA\Property(
            *          property="o_title",
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
            *          property="a_body_type",
            *      ),
            *      @OA\Property(
            *          property="a_body_text",
            *      ),
            *      @OA\Property(
            *          property="a_body_url",
            *      ),
            *      @OA\Property(
            *          property="a_body_file_id",
            *      ),
            *      @OA\Property(
            *          property="o_weight_true",
            *      ),
            *      @OA\Property(
            *          property="o_weight_null",
            *      ),
            *      @OA\Property(
            *          property="o_weight_false",
            *      ),
            *      @OA\Property(
            *          property="o_weight_min",
            *      ),
            *      @OA\Property(
            *          property="o_weight_max",
            *      ),
            *      @OA\Property(
            *          property="assessed_at",
            *      ),
            *      @OA\Property(
            *          property="assessed_by",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return UserExamQuestion Model", @OA\JsonContent()),
                * )
                */
               
class DocUserExamQuestionControllerStoreSwagger  {

}