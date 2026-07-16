<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiBatchRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"title" => [
"nullable",
 ],
"period" => [
"nullable",
 ],
"from" => [
"nullable",
 ],
"to" => [
"nullable",
 ],
"program_id" => [
"nullable",
 ],
"remarks" => [
"nullable",
 ],
"capacity" => [
"nullable",
 ],
 ];

}

}