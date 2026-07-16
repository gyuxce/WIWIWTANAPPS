<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Put(
                * path="/cms/finance/payment-contents/{id}",
                * tags={"Finance - payment_contents"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="title",
            *      ),
            *      @OA\Property(
            *          property="description",
            *      ),
            *      @OA\Property(
            *          property="total_content",
            *      ),
            *      @OA\Property(
            *          property="price_type",
            *      ),
            *      @OA\Property(
            *          property="payment_type",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return PaymentContent Model", @OA\JsonContent()),
                * )
                */
               
class DocPaymentContentControllerUpdateSwagger  {

}