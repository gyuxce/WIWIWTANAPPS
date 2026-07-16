<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiProgramRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"code" => [
"nullable",
 ],
"title" => [
"nullable",
 ],
"description" => [
"nullable",
 ],
"is_active" => [
"nullable",
 ],
 ];

}

}