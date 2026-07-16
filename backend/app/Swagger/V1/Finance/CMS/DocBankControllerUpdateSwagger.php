<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Put(
                * path="/cms/finance/banks/{id}",
                * tags={"Finance - banks"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
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
               
class DocBankControllerUpdateSwagger  {

}