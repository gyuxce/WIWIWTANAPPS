<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Put(
                * path="/training/questions/{id}",
                * tags={"Training - questions"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="type",
            *      ),
            *      @OA\Property(
            *          property="title",
            *      ),
            *      @OA\Property(
            *          property="description",
            *      ),
            *      @OA\Property(
            *          property="b_type",
            *      ),
            *      @OA\Property(
            *          property="b_url",
            *      ),
            *      @OA\Property(
            *          property="b_file_id",
            *      ),
            *      @OA\Property(
            *          property="weight_true",
            *      ),
            *      @OA\Property(
            *          property="weight_null",
            *      ),
            *      @OA\Property(
            *          property="weight_false",
            *      ),
            *      @OA\Property(
            *          property="weight_min",
            *      ),
            *      @OA\Property(
            *          property="weight_max",
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
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Question Model", @OA\JsonContent()),
                * )
                */
               
class DocQuestionControllerUpdateSwagger  {

}