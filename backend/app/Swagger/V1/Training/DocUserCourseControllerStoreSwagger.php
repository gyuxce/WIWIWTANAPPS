<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Post(
                * path="/training/user-courses",
                * tags={"Training - user_courses"},
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="user_id",
            *      ),
            *      @OA\Property(
            *          property="course_id",
            *      ),
            *      @OA\Property(
            *          property="acquired_at",
            *      ),
            *      @OA\Property(
            *          property="started_at",
            *      ),
            *      @OA\Property(
            *          property="finished_at",
            *      ),
            *      @OA\Property(
            *          property="last_activity_at",
            *      ),
            *      @OA\Property(
            *          property="item_finished",
            *      ),
            *      @OA\Property(
            *          property="score_total",
            *      ),
            *      @OA\Property(
            *          property="score_achieved",
            *      ),
            *      @OA\Property(
            *          property="score_normalized",
            *      ),
            *      @OA\Property(
            *          property="exam_score_total",
            *      ),
            *      @OA\Property(
            *          property="exam_score_achieved",
            *      ),
            *      @OA\Property(
            *          property="exam_score_normalized",
            *      ),
            *      @OA\Property(
            *          property="status",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return UserCourse Model", @OA\JsonContent()),
                * )
                */
               
class DocUserCourseControllerStoreSwagger  {

}