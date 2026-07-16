<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Post(
                * path="/training/articles",
                * tags={"Training - articles"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
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
            *          property="duration",
            *      ),
            *      @OA\Property(
            *          property="body_url",
            *      ),
            *      @OA\Property(
            *          property="body_type",
            *      ),
            *      @OA\Property(
            *          property="body_text",
            *      ),
            *      @OA\Property(
            *          property="body_file_id",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Article Model", @OA\JsonContent()),
                * )
                */
               
class DocArticleControllerStoreSwagger  {

}