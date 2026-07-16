<?php

namespace App\Swagger\V1\Finance\CMS;

/**
                *
                * @OA\Post(
                * path="/cms/finance/batch-users",
                * tags={"Finance - batch_users"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="batch_id",
            *      ),
            *      @OA\Property(
            *          property="program_id",
            *      ),
            *      @OA\Property(
            *          property="user_id",
            *      ),
            *      @OA\Property(
            *          property="number",
            *      ),
            *      @OA\Property(
            *          property="from",
            *      ),
            *      @OA\Property(
            *          property="to",
            *      ),
            *      @OA\Property(
            *          property="remarks",
            *      ),
            *      @OA\Property(
            *          property="file_id",
            *      ),
            *      @OA\Property(
            *          property="status",
            *      ),
            *      @OA\Property(
            *          property="transaction_id",
            *      ),
            *      @OA\Property(
            *          property="transaction_status",
            *      ),
            *      @OA\Property(
            *          property="transaction2_id",
            *      ),
            *      @OA\Property(
            *          property="transaction2_status",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return BatchUser Model", @OA\JsonContent()),
                * )
                */
               
class DocBatchUserControllerStoreSwagger  {

}