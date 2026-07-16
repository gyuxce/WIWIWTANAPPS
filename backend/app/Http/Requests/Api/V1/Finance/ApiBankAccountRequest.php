<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiBankAccountRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"name" => [
"nullable",
 ],
"bank_id" => [
"nullable",
 ],
"account_name" => [
"nullable",
 ],
"account_number" => [
"nullable",
 ],
"is_active" => [
"nullable",
 ],
 ];

}

}