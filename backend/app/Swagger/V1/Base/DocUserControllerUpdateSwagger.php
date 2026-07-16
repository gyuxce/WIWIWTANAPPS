<?php

namespace App\Swagger\V1\Base;

/**
 *
 * @OA\Put(
 * path="/base/users/{id}",
 * tags={"Base - users"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
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
 *          property="email_verified_at",
 *      ),
 *      @OA\Property(
 *          property="password_updated_at",
 *      ),
 *      @OA\Property(
 *          property="password",
 *      ),
 *      @OA\Property(
 *          property="username",
 *      ),
 *      @OA\Property(
 *          property="is_active",
 *      ),
 *      @OA\Property(
 *          property="active_date",
 *      ),
 *      @OA\Property(
 *          property="remember_token",
 *      ),
 *      @OA\Property(
 *          property="phone",
 *      ),
 *      @OA\Property(
 *          property="address",
 *      ),
 *      @OA\Property(
 *          property="city_id",
 *      ),
 *      @OA\Property(
 *          property="role_id",
 *      ),
 *      @OA\Property(
 *          property="birthplace",
 *      ),
 *      @OA\Property(
 *          property="dob",
 *      ),
 *      @OA\Property(
 *          property="blood_type",
 *      ),
 *      @OA\Property(
 *          property="last_education",
 *      ),
 *      @OA\Property(
 *          property="ethnic_origin",
 *      ),
 *      @OA\Property(
 *          property="is_training",
 *      ),
 *      @OA\Property(
 *          property="training_program",
 *      ),
 *      @OA\Property(
 *          property="register_information",
 *      ),
 *      @OA\Property(
 *          property="other_register_information",
 *      ),
 *      @OA\Property(
 *          property="study_program",
 *      ),
 *      @OA\Property(
 *          property="certificate_id",
 *      ),
 *      @OA\Property(
 *          property="cv_id",
 *      ),
 *      @OA\Property(
 *          property="profile_pic_id",
 *      ),
 *      @OA\Property(
 *          property="id_card",
 *      ),
 *      @OA\Property(
 *          property="count_login_attempt",
 *      ),
 *      @OA\Property(
 *          property="join_reason",
 *      ),
 *      @OA\Property(
 *          property="education_departement",
 *      ),
 *       @OA\Property(
 *          property="interview_status",
 *      ),
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return User Model", @OA\JsonContent()),
 * )
 */

class DocUserControllerUpdateSwagger
{
}
