<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiTransactionItemRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"transaction_id" => [
"nullable",
 ],
"program_id" => [
"nullable",
 ],
"title" => [
"nullable",
 ],
"description" => [
"nullable",
 ],
"amount" => [
"nullable",
 ],
"quantity" => [
"nullable",
 ],
"is_tax" => [
"nullable",
 ],
"total" => [
"nullable",
 ],
 ];

}

}