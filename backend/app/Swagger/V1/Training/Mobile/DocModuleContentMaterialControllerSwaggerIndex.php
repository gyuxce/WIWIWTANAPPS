<?php

namespace App\Swagger\V1\Training\Mobile;

/**
 *
 * @OA\Get(
 * path="/mobile/training/module/materi/content",
 * tags={"Mobile Training - module"},
 * @OA\Parameter(
 *     name="category_id",
 *     in="query",
 *     description="ID of the category",
 *     required=true,
 *     @OA\Schema(type="string")
 * ),
 * @OA\Parameter(
 *     name="status",
 *     in="query",
 *     description="Status 1 dibaca 2 tidak dibaca",
 *     @OA\Schema(type="integer")
 * ),
 * @OA\Parameter(
 *     name="keyword",
 *     in="query",
 *     description="",
 *     @OA\Schema(type="string")
 * ),
 * @OA\Parameter(ref="#/components/parameters/OA_SortBy"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ForumPost Model", @OA\JsonContent()),
 * )
 *
 */

class DocModuleContentMaterialControllerSwaggerIndex
{
}
