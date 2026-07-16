<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Post(
                * path="/cms/finance/transactions",
                * tags={"Finance - transactions"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="user_id",
            *      ),
            *      @OA\Property(
            *          property="number",
            *      ),
            *      @OA\Property(
            *          property="issued_at",
            *      ),
            *      @OA\Property(
            *          property="expired_at",
            *      ),
            *      @OA\Property(
            *          property="currency_code",
            *      ),
            *      @OA\Property(
            *          property="total_amount",
            *      ),
            *      @OA\Property(
            *          property="total",
            *      ),
            *      @OA\Property(
            *          property="status",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Transaction Model", @OA\JsonContent()),
                * )
                */
               
class DocTransactionControllerStoreSwagger  {

}