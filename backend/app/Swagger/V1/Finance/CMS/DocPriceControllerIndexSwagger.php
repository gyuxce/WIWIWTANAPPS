<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Get(
                * path="/cms/finance/prices",
                * tags={"Finance - prices"},
                * @OA\Parameter(ref="#/components/parameters/OA_listType"),
                * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
                * @OA\Parameter(ref="#/components/parameters/OA_listPage"),
                * @OA\Parameter(ref="#/components/parameters/OA_SortBy"),
                * @OA\Parameter(ref="#/components/parameters/OA_OrderBy"),
                * @OA\Parameter(ref="#/components/parameters/OA_limit"),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * @OA\Parameter(ref="#/components/parameters/OA_options"),
                * @OA\Parameter(ref="#/components/parameters/OA_Cache"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Price Model", @OA\JsonContent()),
                * )
                */
               
class DocPriceControllerIndexSwagger  {

}