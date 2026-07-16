<?php

namespace App\Swagger\V1\Master\CMS;

/**
 *
 * @OA\Get(
 * path="/cms/master/seminar",
 * tags={"CMS - Seminar"},
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
 * path="/cms/master/seminar/{id}",
 * tags={"CMS - Seminar"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Put(
 * path="/cms/master/seminar/{id}",
 * tags={"CMS - Seminar"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="name",
 *      ),
 *      @OA\Property(
 *          property="link",
 *      ),
 *      @OA\Property(
 *          property="description",
 *      ),
 *      @OA\Property(
 *          property="cover_id",
 *      ),
 *      @OA\Property(
 *          property="started_at",
 *      ),
 *      @OA\Property(
 *          property="finished_at",
 *      ),
 *      @OA\Property(
 *          property="status",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 *
 *
 * @OA\Post(
 * path="/cms/master/seminar",
 * tags={"CMS - Seminar"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="name",
 *      ),
 *      @OA\Property(
 *          property="link",
 *      ),
 *      @OA\Property(
 *          property="description",
 *      ),
 *      @OA\Property(
 *          property="cover_id",
 *      ),
 *      @OA\Property(
 *          property="started_at",
 *      ),
 *      @OA\Property(
 *          property="finished_at",
 *      ),
 *      @OA\Property(
 *          property="status",
 *      )
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * 
 * @OA\Delete(
 * path="/cms/master/seminar/{id}",
 * tags={"CMS - Seminar"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 * 
 */

class DocSeminarControllerIndexSwagger
{

}