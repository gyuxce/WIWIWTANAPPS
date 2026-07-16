<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\Document;
use App\Http\Resources\V1\Training\DocumentResource;
use App\Http\Requests\Api\V1\Training\ApiDocumentRequest;
use App\Services\BaseCrud\BaseCrud;

class DocumentController extends BaseCrud {

public $model = Document::class;
public $resource = DocumentResource::class;
public $storeValidator = ApiDocumentRequest::class;
public $updateValidator = ApiDocumentRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}