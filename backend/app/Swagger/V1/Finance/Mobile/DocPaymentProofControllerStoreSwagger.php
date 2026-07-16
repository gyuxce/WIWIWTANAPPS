<?php

namespace App\Swagger\V1\Finance\Mobile;

/**
                *
                * @OA\Post(
                * path="/mobile/finance/payment-proofs",
                * tags={"Mobile Finance - payment_proofs"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                *      @OA\Property(
                *          property="installment_id",
                *      ),
                *      @OA\Property(
                *          property="payment_id",
                *      ),
                *      @OA\Property(
                *          property="transaction_id",
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
               
class DocPaymentProofControllerStoreSwagger  {

}