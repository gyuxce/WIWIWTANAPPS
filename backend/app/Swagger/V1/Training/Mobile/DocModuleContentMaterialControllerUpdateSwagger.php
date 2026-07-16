<?php

namespace App\Swagger\V1\Training\Mobile;

/**
 * @OA\Post(
 *     path="/mobile/training/module/materi",
 *     tags={"Mobile Training - module"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="material_content_id", type="string", example="ambil dari material_content"),
 *             @OA\Property(property="duration", type="integer", example="0"),
 *             @OA\Property(property="status", type="integer", example="1"),
 *
 *         ),
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */
class DocModuleContentMaterialControllerUpdateSwagger
{
}
