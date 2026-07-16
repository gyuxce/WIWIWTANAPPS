<?php

namespace App\Swagger\V1\Base;

/**
 *
 * 
 * @OA\Get(
 * path="/base/settings",
 * tags={"Base - Setting"},
 * @OA\Parameter(ref="#/components/parameters/OA_listType"),
 * @OA\Parameter(ref="#/components/parameters/OA_listQ"),
 * @OA\Parameter(ref="#/components/parameters/OA_listPage"),
 * @OA\Parameter(ref="#/components/parameters/OA_SortBy"),
 * @OA\Parameter(ref="#/components/parameters/OA_OrderBy"),
 * @OA\Parameter(ref="#/components/parameters/OA_limit"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Parameter(ref="#/components/parameters/OA_options"),
 * @OA\Parameter(ref="#/components/parameters/OA_Cache"),
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/base/settings/{id}",
 * tags={"Base - Setting"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Post(
 * path="/base/settings",
 * tags={"Base - Setting"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="name",
 *      ),
 *      @OA\Property(
 *          property="value",
 *      ),
 *      @OA\Property(
 *          property="group",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Put(
 * path="/base/settings/{id}",
 * tags={"Base - Setting"},
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="name",
 *      ),
 *      @OA\Property(
 *          property="value",
 *      ),
 *      @OA\Property(
 *          property="group",
 *      )
 * ))),
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return Model", @OA\JsonContent()),
 * )
 * 
 * 
 * @OA\Post(
 * path="/base/settings/change-password",
 * tags={"Base - Setting"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="password",
 *      ),
 *      @OA\Property(
 *          property="password_confirmation",
 *      )
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 * 
 * 
 * @OA\Post(
 * path="/base/settings/update-profile",
 * tags={"Base - Setting"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="name",
 *      ),
 *      @OA\Property(
 *          property="profile_pic_id",
 *      )
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 * 
 * @OA\Post(
 * path="/base/settings/update",
 * tags={"Base - Setting"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             example={
 *                 "settings": {
 *                     {
 *                         "slug": "fase",
 *                         "value": "2",
 *                     },
 *                     {
 *                         "slug": "nomor-whatsapp-admin-ssw",
 *                         "value": "08985944040",
 *                     },
 *                     {
 *                         "slug": "nomor-whatsapp-admin-titp",
 *                         "value": "08985944040",
 *                     },
 *                     {
 *                         "slug": "nomor-whatsapp-admin-program-pelatihan",
 *                         "value": "08985944040",
 *                     },
 *                 },
 *             }
 *         )
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return Expense Model", @OA\JsonContent())
 * )
 */

class DocSettingsControllerSwagger
{

}