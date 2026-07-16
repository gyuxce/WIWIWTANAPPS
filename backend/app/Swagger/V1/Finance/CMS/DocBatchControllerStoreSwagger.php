<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Post(
                * path="/cms/finance/batches",
                * tags={"Finance - batches"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="title",
            *      ),
            *      @OA\Property(
            *          property="period",
            *      ),
            *      @OA\Property(
            *          property="from",
            *      ),
            *      @OA\Property(
            *          property="to",
            *      ),
            *      @OA\Property(
            *          property="program_id",
            *      ),
            *      @OA\Property(
            *          property="remarks",
            *      ),
            *      @OA\Property(
            *          property="capacity",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Batch Model", @OA\JsonContent()),
                * )
                */
               
class DocBatchControllerStoreSwagger  {

}