<?php

namespace App\Swagger\V1\Master;

/**
 *
 * @OA\Get(
 * path="/master/notifications",
 * tags={"Master - Notifications"},
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
 * 
 * @OA\Post(
 * path="/master/notifications/read/{id}",
 * tags={"Master - Notifications"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/master/notifications/total",
 * tags={"Master - Notifications"},
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return model", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/mobile/notifications",
 * tags={"Mobile - Notifications"},
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
 * 
 * @OA\Post(
 * path="/mobile/notifications/read/{id}",
 * tags={"Mobile - Notifications"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/mobile/notifications/total",
 * tags={"Mobile - Notifications"},
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return model", @OA\JsonContent()),
 * )
 * 
 */

class DocNotificationControllerSwagger
{

}