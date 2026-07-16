<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Post(
                * path="/cms/finance/payment-adpaters",
                * tags={"Finance - payment_adpaters"},
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
            *          property="currency_code",
            *      ),
            *      @OA\Property(
            *          property="total_amount",
            *      ),
            *      @OA\Property(
            *          property="is_active",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return PaymentAdapter Model", @OA\JsonContent()),
                * )
                */
               
class DocPaymentAdapterControllerStoreSwagger  {

}