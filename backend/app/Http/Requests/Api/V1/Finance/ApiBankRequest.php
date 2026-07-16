<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiBankRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"name" => [
"nullable",
 ],
"code" => [
"nullable",
 ],
"remarks" => [
"nullable",
 ],
 ];

}

}