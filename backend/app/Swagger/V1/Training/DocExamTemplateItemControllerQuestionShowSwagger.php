<?php

namespace App\Swagger\V1\Training;
/**
 * @OA\Get(
 *     path="/training/exam-template-items/question/{sesi_question_id}",
 *     tags={"Training - exam_template_items"},
 *     @OA\Parameter(
 *         name="sesi_question_id",
 *         in="path",
 *         required=true,
 *         description="ID of the exam template",
 *         @OA\Schema(type="string")
 *     ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="Return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */

class DocExamTemplateItemControllerQuestionShowSwagger  {

}
