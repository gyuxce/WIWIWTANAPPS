<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Get(
                * path="/training/user-exams",
                * tags={"Training - user_exams"},
                * @OA\Parameter(
                *     in="query",
                *     name="type_pratest",
                *     description="Type of list",
                *     schema={"type": "string", "enum": {"language", "character", "qna"}}
                * ),
                * @OA\Parameter(ref="#/components/parameters/OA_listType"),
                * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
                * @OA\Parameter(ref="#/components/parameters/OA_listPage"),
                * @OA\Parameter(ref="#/components/parameters/OA_SortBy"),
                * @OA\Parameter(ref="#/components/parameters/OA_OrderBy"),
                * @OA\Parameter(ref="#/components/parameters/OA_limit"),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * @OA\Parameter(ref="#/components/parameters/OA_options"),
                * @OA\Parameter(ref="#/components/parameters/OA_Cache"),
                *     @OA\Parameter(
                *         name="status_pra_test",
                *         in="query",
                *         description="Status pra test 0,1,2 atau salah satu",
                *         required=false,
                *         @OA\Schema(type="string")
                *     ),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return UserExam Model", @OA\JsonContent()),
                * )
                */

class DocUserExamControllerIndexSwagger  {

}
