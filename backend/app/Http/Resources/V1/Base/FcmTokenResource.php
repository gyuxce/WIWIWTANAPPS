<?php

namespace App\Http\Resources\V1\Base;


use App\Models\Base\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Master\CitiesResource;
use App\Constants\BloodTypeConstant;
use App\Constants\LastEducationConstant;
use App\Constants\RegisterInformationConstant;
use App\Constants\Training\TrainingProgramConstant;

class FcmTokenResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "os"=> $this->os,
            "token"=> $this->token,
        ];
    }

}