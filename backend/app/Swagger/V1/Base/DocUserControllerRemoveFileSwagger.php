<?php

namespace App\Swagger\V1\Base;

/**
*
* @OA\Post(
* path="/base/users/remove-file/{file_id}",
* tags={"Base - users"},
* @OA\Parameter(
*      name="file_id",
*      in="path",
*      required=true,
*      @OA\Schema(type="string"),
* ),
* @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(

*      @OA\Property(
*          property="description",
*      )
* ))),
* @OA\Parameter(ref="#/components/parameters/OA_Relations"),
* security={{"bearerAuth":{}}},
* @OA\Response(response=200, description="return User Model", @OA\JsonContent()),
* )
*/

class DocUserControllerRemoveFileSwagger
{

}
