<?php

namespace App\Swagger\V1\Forum\CMS;

/**
*
* @OA\Post(
* path="/cms/forum/topics",
* tags={"CMS Forum - topics"},
* @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(

*      @OA\Property(
*          property="name",
*      ),
*      @OA\Property(
*          property="description",
*      ),
*      @OA\Property(
*          property="type",
*      ),
*      @OA\Property(
*          property="count_post",
*      )
* ))),
* @OA\Parameter(ref="#/components/parameters/OA_Relations"),
* security={{"bearerAuth":{}}},
* @OA\Response(response=200, description="return ForumComment Model", @OA\JsonContent()),
* )
*/

class DocForumTopicControllerStoreSwagger
{

}