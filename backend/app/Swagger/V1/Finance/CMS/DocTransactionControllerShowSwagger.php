<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Get(
                * path="/cms/finance/transactions/{id}",
                * tags={"Finance - transactions"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Transaction Model", @OA\JsonContent()),
                * )
                */
               
class DocTransactionControllerShowSwagger  {

}