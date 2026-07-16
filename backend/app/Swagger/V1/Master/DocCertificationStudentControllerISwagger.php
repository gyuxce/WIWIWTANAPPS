<?php

namespace App\Swagger\V1\Master;

/**
 *
 * @OA\Get(
 * path="/cms/master/certification-students",
 * tags={"CMS - certification-students"},
 * @OA\Parameter(
 *  in="query",
 *  description="Filter date, example:2023-10-30,2023-10-31",
 *  name="cert_date",
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
 * path="/cms/master/certification-students/{id}",
 * tags={"CMS - certification-students"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 *
 *
 * @OA\Post(
 * path="/mobile/master/certification-students",
 * tags={"Mobile - certification-students"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="name",
 *      ),
 *      @OA\Property(
 *          property="user_id",
 *      ),
 *      @OA\Property(
 *          property="certification_id",
 *      ),
 *      @OA\Property(
 *          property="location",
 *      ),
 *      @OA\Property(
 *          property="cert_date",
 *      ),
 *      @OA\Property(
 *          property="cert_file_id",
 *      )
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/mobile/master/certification-students",
 * tags={"Mobile - certification-students"},
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
 * @OA\Delete(
 * path="/cms/master/certification-students/{id}",
 * tags={"CMS - certification-students"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 * 
 * @OA\Post(
 * path="/cms/master/certification-students/change-status/{id}",
 * tags={"CMS - certification-students"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
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
 * @OA\Get(
 * path="/cms/master/certification-students/export",
 * tags={"CMS - certification-students"},
 * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
 * @OA\Parameter(ref="#/components/parameters/OA_options"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 */

class DocCertificationStudentControllerISwagger
{

}