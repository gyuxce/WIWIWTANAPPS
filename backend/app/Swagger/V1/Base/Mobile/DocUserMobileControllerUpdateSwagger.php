<?php

namespace App\Swagger\V1\Base\Mobile;

/**
 *
 * @OA\Post(
 * path="/mobile/base/users/update-profile",
 * tags={"Mobile Base - users"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(

 *      @OA\Property(
 *          property="name",
 *      ),
 *      @OA\Property(
 *          property="name_alias",
 *      ),
 *      @OA\Property(
 *          property="email",
 *      ),
 *      @OA\Property(
 *          property="phone",
 *      ),
 *      @OA\Property(
 *          property="city_id",
 *      ),
 *      @OA\Property(
 *          property="address",
 *      ),
 *      @OA\Property(
 *          property="profile_pic_id",
 *      ),
 *      @OA\Property(
 *          property="cv_id",
 *      ),
 *      @OA\Property(
 *          property="join_reason",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return User Model", @OA\JsonContent()),
 * )
 */

class DocUserMobileControllerUpdateSwagger
{
}
