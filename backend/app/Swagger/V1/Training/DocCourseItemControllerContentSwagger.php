<?php

namespace App\Swagger\V1\Training;

/**
 * @OA\Post(
 *     path="/training/course-items/module/content-material",
 *     tags={"Training - course_items (module)"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="course_item_id", type="string", example="ambil dari courses item yang is_header null dan ada parent_id"),
 *             @OA\Property(
 *                 property="contents",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     @OA\Property(property="id", type="string", example="dia ambil dari article jika kirim id dia update jika id kosong dia add"),
 *                     @OA\Property(property="title", type="string"),
 *                     @OA\Property(property="description", type="string"),
 *                     @OA\Property(property="body_type", type="string",  example="ini tipe soalnya 1,2,3 Video,dokumen,text"),
 *                     @OA\Property(property="body_url", type="string"),
 *                     @OA\Property(property="duration", type="string"),
 *                     @OA\Property(property="body_text", type="string"),
 *                     @OA\Property(property="body_file_id", type="string"),
 *                     @OA\Property(property="cover_file_id", type="string"),
 *                 )
 *             ),
 *         )
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return UserExam Model", @OA\JsonContent()),
 * )
 */
class DocCourseItemControllerContentSwagger
{
}
