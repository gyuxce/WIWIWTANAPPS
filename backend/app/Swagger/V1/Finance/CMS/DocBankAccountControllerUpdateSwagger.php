<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Put(
                * path="/cms/finance/bank-accounts/{id}",
                * tags={"Finance - bank_accounts"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="name",
            *      ),
            *      @OA\Property(
            *          property="bank_id",
            *      ),
            *      @OA\Property(
            *          property="account_name",
            *      ),
            *      @OA\Property(
            *          property="account_number",
            *      ),
            *      @OA\Property(
            *          property="is_active",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return BankAccount Model", @OA\JsonContent()),
                * )
                */
               
class DocBankAccountControllerUpdateSwagger  {

}