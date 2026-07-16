<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Post(
                * path="/cms/finance/prices",
                * tags={"Finance - prices"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="type",
            *      ),
            *      @OA\Property(
            *          property="subtype",
            *      ),
            *      @OA\Property(
            *          property="program_id",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Price Model", @OA\JsonContent()),
                * )
                */
               
class DocPriceControllerStoreSwagger  {

}