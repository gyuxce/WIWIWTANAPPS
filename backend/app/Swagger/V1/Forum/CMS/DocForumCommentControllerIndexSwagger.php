<?php

namespace App\Swagger\V1\Forum\CMS;

/**
 *
 * @OA\Get(
 * path="/cms/forum/comments",
 * tags={"CMS Forum - comments"},
 * @OA\Parameter(
 *  in="query",
 *  name="post_id",
 *  description="UUID Forum Post model",
 *      @OA\Schema(
 *          type="string"
 *      )
 *  ),
 *  @OA\Parameter(
 *  in="query",
 *  name="parent_id",
 *  description="UUID Comment model",
 *      @OA\Schema(
 *          type="string"
 *      )
 *  ),
 * @OA\Parameter(ref="#/components/parameters/OA_listType"),
 * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
 * @OA\Parameter(ref="#/components/parameters/OA_listPage"),
 * @OA\Parameter(ref="#/components/parameters/OA_SortBy"),
 * @OA\Parameter(ref="#/components/parameters/OA_OrderBy"),
 * @OA\Parameter(ref="#/components/parameters/OA_limit"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Parameter(ref="#/components/parameters/OA_options"),
 * @OA\Parameter(ref="#/components/parameters/OA_Cache"),
 * @OA\Response(response=200, description="return ForumComment Model", @OA\JsonContent()),
 * )
 */

class DocForumCommentControllerIndexSwagger
{

}