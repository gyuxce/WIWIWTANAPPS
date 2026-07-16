<?php

namespace App\Swagger\V1\Training;

/**
 *
 * @OA\Put(
 * path="/training/interviews/{id}",
 * tags={"Training - interviews"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="type",
 *      ),
 *      @OA\Property(
 *          property="interview_date",
 *      ),
 *      @OA\Property(
 *          property="name",
 *      ),
 *      @OA\Property(
 *          property="position",
 *      ),
 *      @OA\Property(
 *          property="agency",
 *      ),
 *      @OA\Property(
 *          property="link",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */

class DocInterviewControllerUpdateSwagger
{
}
