<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Put(
                * path="/cms/finance/prices/{id}",
                * tags={"Finance - prices"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="type",
            *      ),
            *      @OA\Property(
            *          property="subtype",
            *      ),
            *      @OA\Property(
            *          property="program_id",
            *      ),
            *      @OA\Property(
            *          property="amount",
            *      ),
            *      @OA\Property(
            *          property="training_letter_file_id",
            *      ),
            *      @OA\Property(
            *          property="installment_letter_file_id",
            *      ),
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Price Model", @OA\JsonContent()),
                * )
                */
               
class DocPriceControllerUpdateSwagger  {

}