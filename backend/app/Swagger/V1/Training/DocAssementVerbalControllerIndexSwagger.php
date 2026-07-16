<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Get(
 * path="/training/assesment-verbal/{id}",
 * tags={"Training - assesment verbal"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
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
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return QuestionItem Model", @OA\JsonContent()),
 * )
 */

class DocAssementVerbalControllerIndexSwagger
{
}
