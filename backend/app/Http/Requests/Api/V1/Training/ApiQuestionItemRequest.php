<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiQuestionItemRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"question_id" => [
"nullable",
 ],
"description" => [
"nullable",
 ],
"is_correct" => [
"nullable",
 ],
"body_type" => [
"nullable",
 ],
"body_url" => [
"nullable",
 ],
"body_file_id" => [
"nullable",
 ],
"index" => [
"nullable",
 ],
"weight" => [
"nullable",
 ],
 ];

}

}