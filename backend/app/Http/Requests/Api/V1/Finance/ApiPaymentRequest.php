<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiPaymentRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"transaction_id" => [
"nullable",
 ],
"installment_id" => [
"nullable",
 ],
"expired_at" => [
"nullable",
 ],
"adapter" => [
"nullable",
 ],
"number" => [
"nullable",
 ],
"number_ref" => [
"nullable",
 ],
"currency_code" => [
"nullable",
 ],
"amount" => [
"nullable",
 ],
"fee" => [
"nullable",
 ],
"tax" => [
"nullable",
 ],
"total" => [
"nullable",
 ],
"from_bank_id" => [
"nullable",
 ],
"from_account_number" => [
"nullable",
 ],
"from_account_name" => [
"nullable",
 ],
"to_bank_id" => [
"nullable",
 ],
"to_account_number" => [
"nullable",
 ],
"to_account_name" => [
"nullable",
 ],
"file_id" => [
"nullable",
 ],
"status" => [
"nullable",
 ],
 ];

}

}