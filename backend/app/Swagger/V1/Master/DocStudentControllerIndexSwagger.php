<?php

namespace App\Swagger\V1\Master;

/**
 *
 * @OA\Get(
 * path="/master/student",
 * tags={"CMS - Student"},
 * @OA\Parameter(
 *  in="query",
 *  description="Filter date, example:2023-10-30,2023-10-31",
 *  name="created_at",
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
 * path="/master/student/{id}",
 * tags={"CMS - Student"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 *
 * @OA\Put(
 * path="/master/student/{id}",
 * tags={"CMS - Student"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="name",
 *      ),
 *      @OA\Property(
 *          property="email",
 *      ),
 *      @OA\Property(
 *          property="username",
 *      ),
 *      @OA\Property(
 *          property="is_active",
 *      ),
 *      @OA\Property(
 *          property="phone",
 *      ),
 *      @OA\Property(
 *          property="address",
 *      ),
 *      @OA\Property(
 *          property="blood_type",
 *      ),
 *      @OA\Property(
 *          property="city_id",
 *      ),
 *      @OA\Property(
 *          property="birthplace",
 *      ),
 *      @OA\Property(
 *          property="dob",
 *      ),
 *      @OA\Property(
 *          property="training_program",
 *          description="1 => TITP, 2 => SSW",
 *      ),
 *      @OA\Property(
 *          property="last_education",
 *      ),
 *      @OA\Property(
 *          property="study_program",
 *      ),
 *      @OA\Property(
 *          property="is_training",
 *      ),
 *      @OA\Property(
 *          property="ethnic_origin",
 *      ),
 *      @OA\Property(
 *          property="certificate_id",
 *      ),
 *      @OA\Property(
 *          property="cv_id",
 *      ),
 *      @OA\Property(
 *          property="id_card",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 *
 *
 * @OA\Post(
 * path="/master/student/change-status/{id}",
 * tags={"CMS - Student"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="is_active",
 *      )
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 *
 */

class DocStudentControllerIndexSwagger
{
}
