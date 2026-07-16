<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Get(
                * path="/training/courses/{id}",
                * tags={"Training - courses"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Course Model", @OA\JsonContent()),
                * )
                */
               
class DocCourseControllerShowSwagger  {

}