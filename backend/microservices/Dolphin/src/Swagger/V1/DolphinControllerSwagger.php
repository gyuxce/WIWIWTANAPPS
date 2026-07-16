<?php

namespace DolphinMicroservice\Swagger\V1;

/**
 *
 * 
 * @OA\Post(
 * path="/auth/sign-up",
 * tags={"Auth"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="google_id",
 *      ),    
 *      @OA\Property(
 *          property="facebook_id",
 *      ),  
 *      @OA\Property(
 *          property="apple_id",
 *      ),   
 *      @OA\Property(
 *          property="name",
 *      ),     
 *      @OA\Property(
 *          property="email",
 *      ),
 *      @OA\Property(
 *          property="password",
 *      ),
 *      @OA\Property(
 *          property="password_confirmation",
 *      ),
 *      @OA\Property(
 *          property="phone",
 *      ),
 *      @OA\Property(
 *          property="address",
 *      ),
 *      @OA\Property(
 *          property="city_id",
 *      ),
 *      @OA\Property(
 *          property="id_card",
 *      ),
 *      @OA\Property(
 *          property="birthplace",
 *      ),
 *      @OA\Property(
 *          property="dob",
 *      ),
 *      @OA\Property(
 *          property="blood_type",
 *      ),
 *      @OA\Property(
 *          property="ethnic_origin",
 *      ),
 *      @OA\Property(
 *          property="last_education",
 *      ),
 *      @OA\Property(
 *          property="study_program",
 *      ),
 *      @OA\Property(
 *          property="is_training",
 *      ),
 *      @OA\Property(
 *          property="training_program",
 *      ),
 *      @OA\Property(
 *          property="register_information",
 *      ),
 *      @OA\Property(
 *          property="other_register_information",
 *      )
 * ))),
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 * 
 * @OA\Post(
 * path="/auth/sign-in",
 * tags={"Auth"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="email",
 *      ),
 *      @OA\Property(
 *          property="password",
 *      ),
 *      @OA\Property(
 *          property="is_mobile",
 *      )
 * ))),
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 * 
 * @OA\Post(
 * path="/auth/{adapter}/verify",
 * tags={"Auth"},
 * @OA\Parameter(
 *  in="path",
 *  required=true,
 *  name="adapter",
 *      @OA\Schema(
 *          type="string"
 *      )
 * ),
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="access_token",
 *      ),
 * ))),
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 *
 * @OA\Get(
 * path="/auth/user/me",
 * tags={"Auth"},
 * @OA\Parameter(ref="#/components/parameters/OA_Relations"),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return user Model", @OA\JsonContent()),
 * )
 * 
 * @OA\Get(
 * path="/auth/user/activate/{uuid}",
 * tags={"Auth"},
 * @OA\Parameter(
 *  in="path",
 *  required=true,
 *  name="uuid",
 *      @OA\Schema(
 *          type="string"
 *      )
 *  ),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return success true", @OA\JsonContent()),
 * )
 *
 * @OA\Post(
 * path="/auth/sign-out",
 * tags={"Auth"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="refresh_token",
 *      )
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return success true", @OA\JsonContent()),
 * )
 *
 * @OA\Post(
 * path="/auth/tokens/refresh-token",
 * tags={"Auth"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="refresh_token",
 *      )
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return success true", @OA\JsonContent()),
 * )
 * 
 * @OA\Post(
 * path="/passwords/forgot-password",
 * tags={"Auth"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="email",
 *      ),
 *      @OA\Property(
 *          property="redirect_url",
 *      ),
 *      @OA\Property(
 *          property="is_mobile",
 *      )
 * ))),
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 * 
 * @OA\Post(
 * path="/passwords/reset-password/{token}",
 * tags={"Auth"},
 * @OA\Parameter(
 *  in="path",
 *  name="token",
 *  required=true,
 *      @OA\Schema(
 *          type="string"
 *      )
 *  ),
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="password",
 *      ),
 *      @OA\Property(
 *          property="password_confirmation",
 *      ),
 *      @OA\Property(
 *          property="is_mobile",
 *      )
 * ))),
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 *
 * @OA\Post(
 * path="/auth/user/connect-account",
 * tags={"Auth"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="adapter",
 *      ),
 *      @OA\Property(
 *          property="google_id",
 *      ),
 *      @OA\Property(
 *          property="facebook_id",
 *      ),
 *      @OA\Property(
 *          property="apple_id",
 *      ),
 * ))),
 * security={{"bearerAuth":{}}},
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 * 
 * @OA\Post(
 * path="/auth/social-account",
 * tags={"Auth"},
 * @OA\RequestBody( @OA\MediaType( mediaType="application/x-www-form-urlencoded", @OA\Schema(
 *      @OA\Property(
 *          property="access_token",
 *      ),
 * ))),
 * @OA\Response(response=200, description="return token", @OA\JsonContent()),
 * )
 */

class DolphinControllerSwagger
{
}