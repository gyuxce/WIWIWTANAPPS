<?php

namespace App\Swagger\V1\Forum\Mobile;

/**
*
* @OA\Put(
* path="/mobile/forum/comments/{id}",
* tags={"Mobile Forum - comments"},
* @OA\Parameter(ref="#/components/parameters/OA_id"),
* @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
*      @OA\Property(
*          property="comment",
*      ),
*      @OA\Property(
*          property="parent_id",
*      ),
*      @OA\Property(
*          property="replied_to",
*      ),
*      @OA\Property(
*          property="post_id",
*      )
* ))),
* @OA\Parameter(ref="#/components/parameters/OA_Relations"),
* security={{"bearerAuth":{}}},
* @OA\Response(response=200, description="return ForumComment Model", @OA\JsonContent()),
* )
*/

class DocForumCommentControllerUpdateSwagger
{

}