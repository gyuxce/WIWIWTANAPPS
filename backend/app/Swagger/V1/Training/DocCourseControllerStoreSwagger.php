<?php

namespace App\Swagger\V1\Training;

/**
            *
            * @OA\Post(
            * path="/training/courses",
            * tags={"Training - courses"},
            * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="title",
            *      ),
            *      @OA\Property(
            *          property="title_japan",
            *      ),
            *      @OA\Property(
            *          property="description",
            *      ),
            *      @OA\Property(
            *          property="count_articles",
            *      ),
            *      @OA\Property(
            *          property="count_events",
            *      ),
            *      @OA\Property(
            *          property="count_exam",
            *      ),
            *       @OA\Property(
            *          property="type",
            *      ),
            *      @OA\Property(
            *          property="cover_id",
            *      )
            * ))),
            * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
            * security={{"bearerAuth":{}}},
            * @OA\Response(response=200, description="return Course Model", @OA\JsonContent()),
            * )
            */
               
class DocCourseControllerStoreSwagger  {

}