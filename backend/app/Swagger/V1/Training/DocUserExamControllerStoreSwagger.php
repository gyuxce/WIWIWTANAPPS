<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Post(
 * path="/training/user-exams",
 * tags={"Training - user_exams"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(

 *      @OA\Property(
 *          property="number",
 *      ),
 *      @OA\Property(
 *          property="template_id",
 *      ),
 *      @OA\Property(
 *          property="user_id",
 *      ),
 *      @OA\Property(
 *          property="duration",
 *      ),
 *      @OA\Property(
 *          property="requested_at",
 *      ),
 *      @OA\Property(
 *          property="scheduled_at",
 *      ),
 *      @OA\Property(
 *          property="expired_at",
 *      ),
 *      @OA\Property(
 *          property="started_at",
 *      ),
 *      @OA\Property(
 *          property="finished_at",
 *      ),
 *      @OA\Property(
 *          property="weight_total",
 *      ),
 *      @OA\Property(
 *          property="weight_achieved",
 *      ),
 *      @OA\Property(
 *          property="link",
 *      ),
 *      @OA\Property(
 *          property="status",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return UserExam Model", @OA\JsonContent()),
 * )
 */

class DocUserExamControllerStoreSwagger
{
}
