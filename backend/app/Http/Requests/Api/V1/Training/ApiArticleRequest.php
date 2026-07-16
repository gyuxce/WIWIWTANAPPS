<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiArticleRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
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
"duration" => [
"nullable",
 ],
"body_url" => [
"nullable",
 ],
"body_type" => [
"nullable",
 ],
"body_text" => [
"nullable",
 ],
"body_file_id" => [
"nullable",
 ],
 ];

}

}