<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Get(
 * path="/base/roles",
 * tags={"Role"},
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
 * @OA\Response(response=200, description="return Role Model", @OA\JsonContent()),
 * )
 *
 * @OA\Post(
 * path="/base/roles",
 * tags={"Role"},
 * @OA\RequestBody(
 *  @OA\JsonContent(
 *    type="object",
 *    @OA\Property(property="name", type="string"),
 *    @OA\Property(
 *      property="status",
 *    ),
 *    @OA\Property(property="role_menu", type="array",
 *        @OA\Items(
 *            @OA\Property(property="menu_id", type="integer"),
 *        )),
 *   )
 *),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Bookings Model", @OA\JsonContent()),
 * )
 *
 * @OA\Put(
 * path="/base/roles/{id}",
 * tags={"Role"},
 * @OA\RequestBody(
 *  @OA\JsonContent(
 *    type="object",
 *    @OA\Property(property="name", type="string"),
 *    @OA\Property(
 *      property="status",
 *    ),
 *    @OA\Property(property="role_menu", type="array",
 *        @OA\Items(
 *            @OA\Property(property="menu_id", type="integer"),
 *        )),
 *   )
 *),
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Bookings Model", @OA\JsonContent()),
 * )
 *
 * @OA\Get(
 * path="/base/roles/{id}",
 * tags={"Role"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Bookings Model", @OA\JsonContent()),
 * )
 *
 * * @OA\Delete(
 * path="/base/roles/{id}",
 * tags={"Role"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_ids"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 *
 */

class DocRoleControllerIndexSwagger
{
}
