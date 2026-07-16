<?php

namespace App\Swagger\V1\Master\Mobile;

/**
 *
 * @OA\Get(
 * path="/public/master/seminar",
 * tags={"Public - Seminar"},
 * @OA\Parameter(
 *  in="query",
 *  description="Filter date, example:2023-10-30",
 *  name="started_at",
 *      @OA\Schema(
 *          type="string"
 *      )
 *  ),
 * @OA\Parameter(
 *  in="query",
 *  description="Filter date, example:2023-10-30",
 *  name="finished_at",
 *      @OA\Schema(
 *          type="string"
 *      )
 *  ),
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
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/public/master/seminar/{id}",
 * tags={"Public - Seminar"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 */

class DocSeminarControllerIndexSwagger
{

}