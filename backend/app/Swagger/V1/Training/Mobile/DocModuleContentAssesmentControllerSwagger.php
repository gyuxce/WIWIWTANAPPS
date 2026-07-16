<?php

namespace App\Swagger\V1\Training\Mobile;

/**
 *
 * @OA\Get(
 * path="/mobile/training/module/materi/assesment",
 * tags={"Mobile Training - module"},
 * @OA\Parameter(
 *     name="category_id",
 *     in="query",
 *     description="ID of the category",
 *     required=true,
 *     @OA\Schema(type="string")
 * ),
 * @OA\Parameter(
 *     name="start_date",
 *     in="query",
 *     description="Start date (e.g., 2023-01-01)",
 *     required=false,
 *     @OA\Schema(type="string", format="date", example="2023-01-01")
 * ),
 * @OA\Parameter(
 *     name="end_date",
 *     in="query",
 *     description="End date (e.g., 2023-01-01)",
 *     required=false,
 *     @OA\Schema(type="string", format="date", example="2023-01-01")
 * ),
 * @OA\Parameter(
 *     name="start_weight",
 *     in="query",
 *     description="Weight (e.g., 10)",
 *     required=false,
 *     @OA\Schema(type="string",  example="10")
 * ),
 * @OA\Parameter(
 *     name="end_weight",
 *     in="query",
 *     description="Weight (e.g.,10)",
 *     required=false,
 *     @OA\Schema(type="string",  example="100")
 * ),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ForumPost Model", @OA\JsonContent()),
 * )
 *
 */

class DocModuleContentAssesmentControllerSwagger
{
}
