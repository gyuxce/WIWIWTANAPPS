<?php

namespace App\Swagger\V1\Training;

/**
 * @OA\Put(
 *     path="/training/user-exams/{id}",
 *     tags={"Training - user_exams"},
 *     @OA\Parameter(ref="#/components/parameters/OA_id"),
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="number"),
 *             @OA\Property(property="duration" , type="integer"),
 *             @OA\Property(property="link" , type="string"),
 *             @OA\Property(property="requested_at" , type="date"),
 *             @OA\Property(property="scheduled_at" , type="date"),
 *             @OA\Property(property="expired_at" , type="date"),
 *             @OA\Property(property="started_at" , type="date"),
 *             @OA\Property(property="finished_at" , type="date"),
 *             @OA\Property(property="weight_total", type="integer"),
 *             @OA\Property(property="weight_achieved", type="integer"),
 *             @OA\Property(property="status",type="integer"),
 *             @OA\Property(property="file_tes_karakter_id",type="integer"),
 *             @OA\Property(
 *                 property="exam_schedules",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     @OA\Property(property="id", type="string"),
 *                     @OA\Property(property="start_date", type="string", format="date-time"),
 *                 )
 *             ),
 *         )
 *     ),
 *     @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="return UserExam Model", @OA\JsonContent()),
 * )
 */
class DocUserExamControllerUpdateSwagger
{
}
