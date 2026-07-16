<?php

namespace App\Swagger;

/**
 *
 * @OA\OpenApi(
 *   @OA\Server(
 *      url="/api/v1",
 *      description="62teknologi BE Laravel API"
 *   ),
 *   @OA\Info(
 *      title="62teknologi BE Laravel API",
 *      version="1.0.0",
 *   ),
 * )
 *
 * @OA\SecurityScheme(
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     securityScheme="bearerAuth",
 *     description="Login with email and password to get the authentication token",
 * )
 *
 * @OA\Parameter(
 *  in="path",
 *  parameter="OA_id",
 *  name="id",
 *  description="Key model",
 *  required=true,
 *      @OA\Schema(
 *          type="string"
 *      )
 *  )
 *
 * @OA\Parameter(
 *  in="query",
 *  parameter="OA_listQ",
 *  description="Keyword for search data",
 *  name="q",
 *      @OA\Schema(
 *          type="string"
 *      )
 *  )
 *
 * @OA\Parameter(
 *  in="query",
 *  parameter="OA_method_put",
 *  name="_method",
 *  schema={"type": "string", "enum": {"PUT"}, "default": "PUT"},
 *  required=true
 *  )
 *
 * @OA\Parameter(
 *  in="query",
 *  parameter="OA_listType",
 *  name="type",
 *  description="Type of list",
 *  schema={"type": "string", "enum": {"collection", "pagination"}, "default": "pagination"}
 *  )
 *
 *  @OA\Parameter(
 *  in="query",
 *  parameter="OA_listPage",
 *  description="Number of page usefull if type is pagination",
 *  name="page",
 *      @OA\Schema(
 *          type="string"
 *      )
 *  )
 *
 * @OA\Parameter(
 *  in="query",
 *  parameter="OA_SortBy",
 *  name="sort_by",
 *  description="Sort by",
 *  schema={"type": "string", "enum": {"asc", "desc"}}
 * )
 *
 *
 * @OA\Parameter(
 *  in="query",
 *  parameter="OA_OrderBy",
 *  name="order_by",
 *  description="Order by",
 *      @OA\Schema(
 *          type="string"
 *      )
 *  )
 *
 *
 * @OA\Parameter(
 *  in="query",
 *  parameter="OA_limit",
 *  description="Limit data",
 *  name="limit",
 *      @OA\Schema(
 *          type="integer"
 *      )
 *  )
 *
 *  @OA\Parameter(
 *  in="query",
 *  parameter="OA_Relations",
 *  description="Get relations of the model",
 *  name="relations",
 *  schema={"type": "string"}
 * )
 *
 * @OA\Parameter(
 *  in="query",
 *  parameter="OA_Cache",
 *  description="is cache result",
 *  name="is_cache",
 *  schema={"type": "string", "enum": {"1", "0"}}
 * )
 *
 *  @OA\Parameter(
 *  name="options[]",
 *  parameter="OA_options",
 *  description="Spesific search,has,and,filter,
 *  format => search,field,value
 *  eg => search,title,hot
 *  eg => search,address.country.title,indo
 *  format => has,relation_name
 *  eg => has,orders
 *  format => doesntHave,relation_name
 *  eg => doesntHave,orders
 *  format => filter,field,operation,value
 *  eg => filter,title,equal,hot
 *  eg => filter,title,is_null
 *  eg => filter,title,is_not_null
 *  eg => filter,title,between,1|100
 *  eg => filter,title,not_between,50|100
 *  eg => filter,categories.id,in,1|2|3
 *  eg => filter,categories.id,not_in,1|2|3
 *  field is support relationships
 *  list of operation => equal, not_equal, in, not_in, less_then, greater_than, less_then_equal, greater_than_equal, is_null, is_not_null, between, not_between",
 *  in="query",
 *  @OA\Schema(
 *  type="array",
 *  @OA\Items(type="string")
 *  )
 * )
 *
 * @OA\Parameter(
 *  name="ids[]",
 *  parameter="OA_ids",
 *  description="",
 *  in="query",
 *  @OA\Schema(
 *  type="array",
 *  @OA\Items(type="string")
 *  )
 * )
 *
 * @OA\Parameter(
 *  in="query",
 *  parameter="OA_listConstant",
 *  name="data",
 *  description="Data list",
 *  schema={"type": "string", "enum": {
 *      "blood_type",
 *      "last_education",
 *      "register_information",
 *      "training_program",
 *      "training_preference",
 *      "forum_topic_type",
 *      "forum_report_type",
 *      "forum_report_status",
 *      "seminar_status",
 *      "content_notif_status",
 *      "content_notif_repeat",
 *      "certification_status",
 *      "certification_student_status",
 *      "training_level",
 *      "training_access_module",
 *      "course_item_group",
 *      "course_type",
 *      "question_type",
 *      "transaction_administration_status",
 *      "transaction_training_status",
 *      "batch_user_status",
 *      "installment_period_type",
 *      "payment_proof_status",
 *      "payment_status",
 *      "language",
 *      "phase",
 *      "price_type",
 *      "payment_type",
 *      "user_files_constant",
 *      "user_files_slug",
 *      "interview_type",
 *      "article_type",
 *      "user_article_status",
 *      "exam_template",
 *      "user_course_item_status",
 *      "status_pratest",
 *      "content_notification_target",
 *      "status_scheduled_assesment_verbal",
 *    }, "default": "blood_type"}
 *  )
 *
 */

class Swagger
{
}
