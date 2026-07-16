<?php

namespace App\Http\Controllers\Api\V1\Forum;

use App\Http\Resources\V1\Forum\ForumPostResource;
use App\Models\Forum\ForumPost;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Illuminate\Support\Facades\Auth;

class MyForumPostController extends BaseCrud
{
    use HasLogHelper;
    public $model = ForumPost::class;
    public $resource = ForumPostResource::class;
    public $searchAble = ["title"];

    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareQueryList() {
        $this->query->where('user_id', Auth::id());
        return $this->query;
    }
}
