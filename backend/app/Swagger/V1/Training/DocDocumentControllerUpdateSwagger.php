<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Put(
                * path="/training/documents/{id}",
                * tags={"Training - documents"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="user_id",
            *      ),
            *      @OA\Property(
            *          property="type",
            *      ),
            *      @OA\Property(
            *          property="remarks",
            *      ),
            *      @OA\Property(
            *          property="file_id",
            *      ),
            *      @OA\Property(
            *          property="is_verified",
            *      ),
            *      @OA\Property(
            *          property="verified_by",
            *      ),
            *      @OA\Property(
            *          property="verified_at",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Document Model", @OA\JsonContent()),
                * )
                */
               
class DocDocumentControllerUpdateSwagger  {

}