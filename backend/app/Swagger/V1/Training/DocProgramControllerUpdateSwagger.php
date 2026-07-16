<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Put(
                * path="/training/programs/{id}",
                * tags={"Training - programs"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="code",
            *      ),
            *      @OA\Property(
            *          property="title",
            *      ),
            *      @OA\Property(
            *          property="description",
            *      ),
            *      @OA\Property(
            *          property="is_active",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Program Model", @OA\JsonContent()),
                * )
                */
               
class DocProgramControllerUpdateSwagger  {

}