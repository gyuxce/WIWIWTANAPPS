<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Get(
                * path="/training/articles/{id}",
                * tags={"Training - articles"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Article Model", @OA\JsonContent()),
                * )
                */
               
class DocArticleControllerShowSwagger  {

}