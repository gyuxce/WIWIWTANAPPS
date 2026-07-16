<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\Article;
use App\Http\Resources\V1\Training\ArticleResource;
use App\Http\Requests\Api\V1\Training\ApiArticleRequest;
use App\Services\BaseCrud\BaseCrud;

class ArticleController extends BaseCrud {

public $model = Article::class;
public $resource = ArticleResource::class;
public $storeValidator = ApiArticleRequest::class;
public $updateValidator = ApiArticleRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}