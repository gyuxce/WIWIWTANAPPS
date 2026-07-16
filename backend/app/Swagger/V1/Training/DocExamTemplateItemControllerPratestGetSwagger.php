<?php

namespace App\Swagger\V1\Training;
/**
 * @OA\Get(
 *     path="/training/exam-template-items/pratest",
 *     tags={"Training - exam_template_items"},
 *           @OA\Parameter(
 *           in="query",
 *           name="template",
 *           description="Type of list",
 *           schema={"type": "string", "enum": {"language", "character", "qna"}}
 *       ),
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="Return ExamTemplateItem Model", @OA\JsonContent()),
 * )
 */

class DocExamTemplateItemControllerPratestGetSwagger  {

}
