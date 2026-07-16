<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Post(
                * path="/cms/finance/transaction-items",
                * tags={"Finance - transaction_items"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="transaction_id",
            *      ),
            *      @OA\Property(
            *          property="program_id",
            *      ),
            *      @OA\Property(
            *          property="title",
            *      ),
            *      @OA\Property(
            *          property="description",
            *      ),
            *      @OA\Property(
            *          property="amount",
            *      ),
            *      @OA\Property(
            *          property="quantity",
            *      ),
            *      @OA\Property(
            *          property="is_tax",
            *      ),
            *      @OA\Property(
            *          property="total",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return TransactionItem Model", @OA\JsonContent()),
                * )
                */
               
class DocTransactionItemControllerStoreSwagger  {

}