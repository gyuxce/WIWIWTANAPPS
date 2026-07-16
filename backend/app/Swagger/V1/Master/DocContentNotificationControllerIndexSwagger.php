<?php

namespace App\Swagger\V1\Master;

/**
 *
 * @OA\Get(
 * path="/master/content-notifications",
 * tags={"Master - ContentNotification"},
 * @OA\Parameter(ref="#/components/parameters/OA_listType"),
 * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
 * @OA\Parameter(ref="#/components/parameters/OA_listPage"),
 * @OA\Parameter(ref="#/components/parameters/OA_SortBy"),
 * @OA\Parameter(ref="#/components/parameters/OA_OrderBy"),
 * @OA\Parameter(ref="#/components/parameters/OA_limit"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Parameter(ref="#/components/parameters/OA_options"),
 * @OA\Parameter(ref="#/components/parameters/OA_Cache"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/master/content-notifications/{id}",
 * tags={"Master - ContentNotification"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Put(
 * path="/master/content-notifications/{id}",
 * tags={"Master - ContentNotification"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\RequestBody(
 *      @OA\JsonContent(
 *          type="object",
 *          @OA\Property(property="name", type="string", example="Example task"),
 *          @OA\Property(property="description", type="string", example="Example description"),
 *          @OA\Property(property="send_at", type="string", format="date-time", example="2023-11-07T10:00:00Z"),
 *          @OA\Property(property="repeat_each", type="integer", example=1),
 *          @OA\Property(property="status", type="integer", example=1),
 *          @OA\Property(property="is_active", type="integer", example=1),
 *          @OA\Property(
 *              property="target",
 *              type="array",
 *              @OA\Items(
 *              ),
 *              example={
 *                  {
 *                      "user_id": "0fcc2d4b-ce15-4c72-848f-1dbba42dc375",
 *                  },
 *                  {
 *                      "user_id": "21efd287-0db3-4c79-8356-2f5a9f3d08cc",
 *                  }
 *              }
 *          ),
 *      ),
 *  ),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 *
 *
 * @OA\Post(
 * path="/master/content-notifications",
 * tags={"Master - ContentNotification"},
 * @OA\RequestBody(
 *      @OA\JsonContent(
 *          type="object",
 *          @OA\Property(property="name", type="string", example="Example task"),
 *          @OA\Property(property="description", type="string", example="Example description"),
 *          @OA\Property(property="link", type="string", example="Example description"),
 *          @OA\Property(property="send_at", type="string", format="date-time", example="2023-11-07T10:00:00Z"),
 *          @OA\Property(property="repeat_each", type="integer", example=1),
 *          @OA\Property(property="status", type="integer", example=1),
 *          @OA\Property(property="is_active", type="integer", example=1),
 *          @OA\Property(property="target_status", type="integer", example=1),
 *          @OA\Property(
 *              property="target",
 *              type="array",
 *              @OA\Items(
 *              ),
 *              example={
 *                  {
 *                      "user_id": "0fcc2d4b-ce15-4c72-848f-1dbba42dc375",
 *                  },
 *                  {
 *                      "user_id": "21efd287-0db3-4c79-8356-2f5a9f3d08cc",
 *                  }
 *              }
 *          ),
 *      ),
 *  ),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * 
 * @OA\Delete(
 * path="/master/content-notifications/{id}",
 * tags={"Master - ContentNotification"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Success true", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/master/content-notification-sent",
 * tags={"Master - ContentNotification"},
 * @OA\Parameter(ref="#/components/parameters/OA_listType"),
 * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
 * @OA\Parameter(ref="#/components/parameters/OA_listPage"),
 * @OA\Parameter(ref="#/components/parameters/OA_SortBy"),
 * @OA\Parameter(ref="#/components/parameters/OA_OrderBy"),
 * @OA\Parameter(ref="#/components/parameters/OA_limit"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Parameter(ref="#/components/parameters/OA_options"),
 * @OA\Parameter(ref="#/components/parameters/OA_Cache"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 */

class DocContentNotificationControllerIndexSwagger
{

}