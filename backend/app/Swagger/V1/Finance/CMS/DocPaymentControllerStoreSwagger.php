<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Post(
                * path="/cms/finance/payments",
                * tags={"Finance - payments"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="transaction_id",
            *      ),
            *      @OA\Property(
            *          property="installment_id",
            *      ),
            *      @OA\Property(
            *          property="expired_at",
            *      ),
            *      @OA\Property(
            *          property="adapter",
            *      ),
            *      @OA\Property(
            *          property="number",
            *      ),
            *      @OA\Property(
            *          property="number_ref",
            *      ),
            *      @OA\Property(
            *          property="currency_code",
            *      ),
            *      @OA\Property(
            *          property="amount",
            *      ),
            *      @OA\Property(
            *          property="fee",
            *      ),
            *      @OA\Property(
            *          property="tax",
            *      ),
            *      @OA\Property(
            *          property="total",
            *      ),
            *      @OA\Property(
            *          property="from_bank_id",
            *      ),
            *      @OA\Property(
            *          property="from_account_number",
            *      ),
            *      @OA\Property(
            *          property="from_account_name",
            *      ),
            *      @OA\Property(
            *          property="to_bank_id",
            *      ),
            *      @OA\Property(
            *          property="to_account_number",
            *      ),
            *      @OA\Property(
            *          property="to_account_name",
            *      ),
            *      @OA\Property(
            *          property="file_id",
            *      ),
            *      @OA\Property(
            *          property="status",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Payment Model", @OA\JsonContent()),
                * )
                */
               
class DocPaymentControllerStoreSwagger  {

}