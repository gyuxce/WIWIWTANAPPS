<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiUserCourseRequest extends FormRequest {

public function authorize(){

return true;}

 public function rules(){
 return [
"user_id" => [
"nullable",
 ],
"course_id" => [
"nullable",
 ],
"acquired_at" => [
"nullable",
 ],
"started_at" => [
"nullable",
 ],
"finished_at" => [
"nullable",
 ],
"last_activity_at" => [
"nullable",
 ],
"item_finished" => [
"nullable",
 ],
"score_total" => [
"nullable",
 ],
"score_achieved" => [
"nullable",
 ],
"score_normalized" => [
"nullable",
 ],
"exam_score_total" => [
"nullable",
 ],
"exam_score_achieved" => [
"nullable",
 ],
"exam_score_normalized" => [
"nullable",
 ],
"status" => [
"nullable",
 ],
 ];

}

}