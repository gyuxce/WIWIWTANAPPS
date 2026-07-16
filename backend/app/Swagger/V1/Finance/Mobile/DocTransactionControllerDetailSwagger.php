<?php

namespace App\Swagger\V1\Finance\Mobile;

/**
                *
                * @OA\Get(
                * path="/mobile/finance/transactions/detail",
                * tags={"Mobile Finance - transactions"},
                * @OA\Parameter(
                *  in="query",
                *  name="payment_type",
                *  description="Get value payment_type from api constant (Lunas/Cicilan)",
                *  name="payment_type",
                *      @OA\Schema(
                *          type="integer"
                *      )
                *  ),
                * @OA\Parameter(
                *  in="query",
                *  name="price_type",
                *  description="Get value price_type from api constant (Administrasi/Pelatihan)",
                *  name="price_type",
                *      @OA\Schema(
                *          type="integer"
                *      )
                *  ),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Price Model", @OA\JsonContent()),
                * )
                */
               
class DocTransactionControllerDetailSwagger  {

}