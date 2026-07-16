<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiUserExamQuestionItemRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"user_exam_id" => [
"nullable",
 ],
"question_id" => [
"nullable",
 ],
"is_selected" => [
"nullable",
 ],
"index" => [
"nullable",
 ],
"o_description" => [
"nullable",
 ],
"o_body_type" => [
"nullable",
 ],
"o_body_url" => [
"nullable",
 ],
"o_body_file_id" => [
"nullable",
 ],
"o_is_correct" => [
"nullable",
 ],
"o_weight" => [
"nullable",
 ],
 ];

}

}