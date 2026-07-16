<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiQuestionRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"type" => [
"nullable",
 ],
"title" => [
"nullable",
 ],
"description" => [
"nullable",
 ],
"b_type" => [
"nullable",
 ],
"b_url" => [
"nullable",
 ],
"b_file_id" => [
"nullable",
 ],
"weight_true" => [
"nullable",
 ],
"weight_null" => [
"nullable",
 ],
"weight_false" => [
"nullable",
 ],
"weight_min" => [
"nullable",
 ],
"weight_max" => [
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
 ];

}

}