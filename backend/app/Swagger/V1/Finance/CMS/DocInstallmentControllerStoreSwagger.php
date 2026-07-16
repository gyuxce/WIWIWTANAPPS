<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Post(
                * path="/cms/finance/installments",
                * tags={"Finance - installments"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="transaction_id",
            *      ),
            *      @OA\Property(
            *          property="period_type",
            *      ),
            *      @OA\Property(
            *          property="period_length",
            *      ),
            *      @OA\Property(
            *          property="payment_first_id",
            *      ),
            *      @OA\Property(
            *          property="payment_first_at",
            *      ),
            *      @OA\Property(
            *          property="payment_next_id",
            *      ),
            *      @OA\Property(
            *          property="payment_next_at",
            *      ),
            *      @OA\Property(
            *          property="payment_last_id",
            *      ),
            *      @OA\Property(
            *          property="payment_last_at",
            *      ),
            *      @OA\Property(
            *          property="is_paid",
            *      ),
            *      @OA\Property(
            *          property="index",
            *      ),
            *      @OA\Property(
            *          property="file_id",
            *      ),
            *      @OA\Property(
            *          property="file2_id",
            *      ),
            *      @OA\Property(
            *          property="file3_id",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Installment Model", @OA\JsonContent()),
                * )
                */
               
class DocInstallmentControllerStoreSwagger  {

}