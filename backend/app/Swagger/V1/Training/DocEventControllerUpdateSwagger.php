<?php

namespace App\Swagger\V1\Training;

/**
                *
                * @OA\Put(
                * path="/training/events/{id}",
                * tags={"Training - events"},
                * @OA\Parameter(ref="#/components/parameters/OA_id"),
                * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
                
            *      @OA\Property(
            *          property="title",
            *      ),
            *      @OA\Property(
            *          property="description",
            *      ),
            *      @OA\Property(
            *          property="from",
            *      ),
            *      @OA\Property(
            *          property="to",
            *      ),
            *      @OA\Property(
            *          property="started_at",
            *      ),
            *      @OA\Property(
            *          property="finished_at",
            *      ),
            *      @OA\Property(
            *          property="recording_file_id",
            *      ),
            *      @OA\Property(
            *          property="external_url",
            *      ),
            *      @OA\Property(
            *          property="external_passkey",
            *      ),
            *      @OA\Property(
            *          property="status",
            *      ),
            *      @OA\Property(
            *          property="cover_file_id",
            *      ),
            *      @OA\Property(
            *          property="participant_max",
            *      ),
            *      @OA\Property(
            *          property="is_online",
            *      ),
            *      @OA\Property(
            *          property="address_id",
            *      ),
            *      @OA\Property(
            *          property="is_active",
            *      )
                * ))),
                * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
                * security={{"bearerAuth":{}}},
                * @OA\Response(response=200, description="return Event Model", @OA\JsonContent()),
                * )
                */
               
class DocEventControllerUpdateSwagger  {

}