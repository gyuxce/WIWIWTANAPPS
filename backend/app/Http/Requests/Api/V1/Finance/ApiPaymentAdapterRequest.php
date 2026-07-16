<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiPaymentAdapterRequest extends FormRequest {

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
"currency_code" => [
"nullable",
 ],
"total_amount" => [
"nullable",
 ],
"is_active" => [
"nullable",
 ],
 ];

}

}