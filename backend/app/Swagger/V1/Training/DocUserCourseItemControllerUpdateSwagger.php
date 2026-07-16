<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Put(
                * path="/training/user-course-items/{id}",
                * tags={"Training - user_course_items"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="user_id",
            *      ),
            *      @OA\Property(
            *          property="course_id",
            *      ),
            *      @OA\Property(
            *          property="item_id",
            *      ),
            *      @OA\Property(
            *          property="progress",
            *      ),
            *      @OA\Property(
            *          property="user_exam_id",
            *      ),
            *      @OA\Property(
            *          property="event_id",
            *      ),
            *      @OA\Property(
            *          property="is_skipped",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return UserCourseItem Model", @OA\JsonContent()),
                * )
                */
               
class DocUserCourseItemControllerUpdateSwagger  {

}