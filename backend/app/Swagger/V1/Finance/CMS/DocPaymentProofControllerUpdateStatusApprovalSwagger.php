<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Put(
                * path="/cms/finance/payment-proofs/approval-status/{id}",
                * tags={"Finance - payment_proofs"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                *      @OA\Property(
                *          property="status",
                *      ),
                *      @OA\Property(
                *          property="total_amount_approved",
                *      ),
                *      @OA\Property(
                *          property="note",
                *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return PaymentProof Model", @OA\JsonContent()),
                * )
                */
               
class DocPaymentProofControllerUpdateStatusApprovalSwagger  {

}