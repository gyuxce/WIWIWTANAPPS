<?php

namespace App\Swagger\V1\Training;

/**
 * @OA\Get(
 *     path="/mobile/training/user-exams/progress",
 *     tags={"Mobile Training - user_exams"},
 *     @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return UserExam Model", @OA\JsonContent()),
 * )
 */
class DocUserExamControllerGetProgressSwagger {

}
