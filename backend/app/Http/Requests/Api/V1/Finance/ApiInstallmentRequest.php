<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiInstallmentRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"transaction_id" => [
"nullable",
 ],
"period_type" => [
"nullable",
 ],
"period_length" => [
"nullable",
 ],
"payment_first_id" => [
"nullable",
 ],
"payment_first_at" => [
"nullable",
 ],
"payment_next_id" => [
"nullable",
 ],
"payment_next_at" => [
"nullable",
 ],
"payment_last_id" => [
"nullable",
 ],
"payment_last_at" => [
"nullable",
 ],
"is_paid" => [
"nullable",
 ],
"index" => [
"nullable",
 ],
"file_id" => [
"nullable",
 ],
"file2_id" => [
"nullable",
 ],
"file3_id" => [
"nullable",
 ],
 ];

}

}