<?php

namespace App\Swagger\V1\Training;

/**
 * @OA\Put(
 *     path="/training/assesment-verbal/{id}",
 *     tags={"Training - assesment verbal"},
 *     @OA\Parameter(ref="#/components/parameters/OA_id"),
 *     @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(  
 *     @OA\Property(
 *          property="working_date",
 *      ),
 *      @OA\Property(
 *          property="link",
 *      )
 *     ))),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return UserCourseItem Model", @OA\JsonContent()),
 * )
 */
class DocAssementVerbalControllerUpdateSwagger
{
}
