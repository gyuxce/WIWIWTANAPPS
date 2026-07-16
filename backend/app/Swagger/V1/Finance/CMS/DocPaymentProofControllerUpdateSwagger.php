<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Put(
                * path="/cms/finance/payment-proofs/{id}",
                * tags={"Finance - payment_proofs"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="user_id",
            *      ),
            *      @OA\Property(
            *          property="transaction_id",
            *      ),
            *      @OA\Property(
            *          property="installment_id",
            *      ),
            *      @OA\Property(
            *          property="date",
            *      ),
            *      @OA\Property(
            *          property="adapter",
            *      ),
            *      @OA\Property(
            *          property="currency_code",
            *      ),
            *      @OA\Property(
            *          property="amount",
            *      ),
            *      @OA\Property(
            *          property="from_bank_id",
            *      ),
            *      @OA\Property(
            *          property="from_bank_number",
            *      ),
            *      @OA\Property(
            *          property="from_bank_name",
            *      ),
            *      @OA\Property(
            *          property="to_bank_id",
            *      ),
            *      @OA\Property(
            *          property="to_bank_number",
            *      ),
            *      @OA\Property(
            *          property="to_account_name",
            *      ),
            *      @OA\Property(
            *          property="from_account_number",
            *      ),
            *      @OA\Property(
            *          property="from_account_name",
            *      ),
            *      @OA\Property(
            *          property="to_account_number",
            *      ),
            *      @OA\Property(
            *          property="status",
            *      ),
            *      @OA\Property(
            *          property="file_id",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return PaymentProof Model", @OA\JsonContent()),
                * )
                */
               
class DocPaymentProofControllerUpdateSwagger  {

}