<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Get(
                * path="/training/questions/{id}",
                * tags={"Training - questions"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Question Model", @OA\JsonContent()),
                * )
                */
               
class DocQuestionControllerShowSwagger  {

}