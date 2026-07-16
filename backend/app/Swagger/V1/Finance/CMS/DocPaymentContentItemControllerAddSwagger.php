<?php

namespace App\Swagger\V1\Finance\CMS;

/**
*
* @OA\Post(
 * path="/cms/finance/payment-content-items/add/{id}",
 * @OA\Parameter(ref="#/components/parameters/OA_id"),
 * tags={"Finance - payment_content_items"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="content_items",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                      @OA\Property(property="title", type="string", example="Title"),
 *                      @OA\Property(property="description", type="string", example="Description"),
 *                      @OA\Property(
 *                          property="child",
 *                          type="array",
 *                          @OA\Items(
 *                              type="object",
 *                               @OA\Property(property="title", type="string", example="Title"),
 *                               @OA\Property(property="description", type="string", example="Description"),
 *                               @OA\Property(property="language_type", type="integer", example=1),
 *
 *                              ),
 *                          ),
 *                 ),
 *             ),
 *         ),
 *     ),
* security={{"bearerAuth":{}}},
* @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
* )
*/

class DocPaymentContentItemControllerAddSwagger  {

}
