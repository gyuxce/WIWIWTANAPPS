<?php

namespace App\Swagger\V1\Finance\Mobile;

/**
                *
                * @OA\Post(
                * path="/mobile/finance/transactions",
                * tags={"Mobile Finance - transactions"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                *      @OA\Property(
                *          property="price_type",
                *      ),
                *      @OA\Property(
                *          property="payment_type",
                *      ),
                *      @OA\Property(
                *          property="issued_at",
                *      ),
                *      @OA\Property(
                *          property="total_recurrence",
                *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Transaction Model", @OA\JsonContent()),
                * )
                */
               
class DocTransactionControllerStoreSwagger  {

}