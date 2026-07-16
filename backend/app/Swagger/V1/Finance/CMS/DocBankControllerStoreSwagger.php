<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Post(
                * path="/cms/finance/banks",
                * tags={"Finance - banks"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="name",
            *      ),
            *      @OA\Property(
            *          property="code",
            *      ),
            *      @OA\Property(
            *          property="remarks",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Bank Model", @OA\JsonContent()),
                * )
                */
               
class DocBankControllerStoreSwagger  {

}