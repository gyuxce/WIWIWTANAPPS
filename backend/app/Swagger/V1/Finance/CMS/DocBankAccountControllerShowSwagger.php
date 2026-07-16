<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Get(
                * path="/cms/finance/bank-accounts/{id}",
                * tags={"Finance - bank_accounts"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return BankAccount Model", @OA\JsonContent()),
                * )
                */
               
class DocBankAccountControllerShowSwagger  {

}