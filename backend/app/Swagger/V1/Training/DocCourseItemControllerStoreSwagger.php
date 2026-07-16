<?php

namespace App\Swagger\V1\Training;

/**
 * 
 * @OA\Post(
 * path="/training/course-items/module",
 * tags={"Training - course_items (module)"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="group",
 *      ),
 *      @OA\Property(
 *          property="course_id",
 *      ),
 *      @OA\Property(
 *          property="parent_id",
 *      ),
 *      @OA\Property(
 *          property="is_header",
 *      ),
 *      @OA\Property(
 *          property="title",
 *      ),
 *      @OA\Property(
 *          property="description",
 *      ),
 *      @OA\Property(
 *          property="article_id",
 *      ),
 *      @OA\Property(
 *          property="exam_template_id",
 *      ),
 *      @OA\Property(
 *          property="event_id",
 *      ),
 *      @OA\Property(
 *          property="index",
 *      ),
 *      @OA\Property(
 *          property="type",
 *      ),
 *      @OA\Property(
 *          property="program_type",
 *      ),
 *      @OA\Property(
 *          property="level_module",
 *      ),
 *      @OA\Property(
 *          property="access_module",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return CourseItem Model", @OA\JsonContent()),
 * )
 */

class DocCourseItemControllerStoreSwagger  {

}