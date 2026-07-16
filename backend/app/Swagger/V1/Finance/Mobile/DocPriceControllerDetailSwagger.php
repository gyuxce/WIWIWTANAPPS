<?php

namespace App\Swagger\V1\Finance\Mobile;

/**
                *
                * @OA\Get(
                * path="/mobile/finance/prices/detail/{type}",
                * tags={"Mobile Finance - prices"},
                *  @OA\Parameter(
                *  in="path",
                *  name="type",
                *  description="Type",
                *  required=true,
                *      @OA\Schema(
                *          type="string"
                *      )
                *  ),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Price Model", @OA\JsonContent()),
                * )
                */
               
class DocPriceControllerDetailSwagger  {

}