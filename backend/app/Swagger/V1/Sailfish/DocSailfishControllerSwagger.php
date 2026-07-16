<?php

namespace App\Swagger\V1\Sailfish;

/**
 *
 * @OA\Post(
 * path="/sailfish/fcm-token",
 * tags={"FCM"},
 * @OA\RequestBody(
 *      @OA\JsonContent(
 *          type="object",
 *          @OA\Property(property="user_id", type="string", example="User UUID"),
 *          @OA\Property(property="os", type="string"),
 *          @OA\Property(property="token", type="string"),
 *      ),
 *  ),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Post(
 * path="/sailfish/push-notifications",
 * tags={"FCM"},
 * @OA\RequestBody(
 *      @OA\JsonContent(
 *          type="object",
 *          @OA\Property(property="title", type="string", example="Example task"),
 *          @OA\Property(property="body", type="string", example="Example description"),
 *          @OA\Property(
 *              property="tokens",
 *              type="array",
 *              @OA\Items(
 *              ),
 *          ),
 *          @OA\Property(
 *              property="data",
 *              type="array",
 *              @OA\Items(
 *              ),
 *              example={
 *                  {
 *                      "params": "params",
 *                  }
 *              }
 *          ),
 *      ),
 *  ),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 */

class DocSailfishControllerSwagger
{

}