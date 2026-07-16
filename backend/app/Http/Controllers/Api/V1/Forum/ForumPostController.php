<?php

namespace App\Http\Controllers\Api\V1\Forum;

use Illuminate\Support\Facades\Auth;
use App\Http\Resources\V1\Forum\ForumPostResource;
use App\Http\Requests\Api\V1\Forum\ApiForumPostRequest;
use App\Http\Controllers\Api\V1\Sailfish\HasNotifications;
use App\Models\Forum\ForumPost;
use App\Models\Forum\ForumTopic;
use App\Models\Base\User;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use App\Repositories\ForumPostRepository;
use App\Constants\Forum\ForumPostStatusReport;
use Illuminate\Http\Request;

class ForumPostController extends BaseCrud
{
    use HasLogHelper, HasNotifications;
    public $model = ForumPost::class;
    public $resource = ForumPostResource::class;
    public $searchAble = ["title"];

    public $storeValidator = ApiForumPostRequest::class;
    public $updateValidator = ApiForumPostRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public $repo;

    public function __construct()
    {
        $this->repo = new ForumPostRepository();
    }

    public function __prepareQueryList()
    {
        $filterType = request('type_post');

        if ($filterType == 'populer') {
            $this->query = $this->repo->postPopuler();
        } else if ($filterType == 'trending') {
            $this->query = $this->repo->postTrending();
        }

        return $this->query;
    }

    public function __prepareDataStore($data)
    {
        $data['user_id'] = Auth::id();
        $data['topic_id'] = ForumTopic::getId($data['topic_id']);
        if ($data['is_publish'] == 1) {
            $this->__countPostTopic($data['topic_id'], "created");
        }

        return $data;
    }

    public function __prepareDataUpdate($data)
    {
        $data = $this->__prepareDataStore($data);
        unset($data["created_by"]);

        return $data;
    }

    public function __afterStore()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "created", null);
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function __beforeUpdate()
    {
        $createdAt = $this->row->created_at;
        $date1 = new \DateTime();
        $date2 = new \DateTime($createdAt);

        $diff = $date2->diff($date1);

        $hours = $diff->h + ($diff->days * 24);

        if ($hours > 24) {
            return ['success' => false, "message" => "Komentar tidak dapat di update karena lebih dari 24 jam."];
        }
    }

    public function __beforeDestroy()
    {
        $this->row->update([
            "deleted_reason" => request('deleted_reason'),
            "status_report" => ForumPostStatusReport::STATUS_DELETED,
        ]);

        # send notification for post pubbish
        $notifdata = ["title" => "Post", "body" => "[" . $this->row->title . "] Postingan anda dihapus oleh [" . Auth::user()->name . "] karena [" . request('deleted_reason') . "]", "data" => ["module" => "forum-post", "post_id" => $this->row->uuid]];
        $this->__pushNotification($this->row->user, $notifdata);

        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "deleted", null);
        if ($this->row->is_publish === 1) {
            $this->__countPostTopic($this->row->topic_id, "deleted");
        }
    }

    public function __countPostTopic($topic_id, $action)
    {
        $topic = ForumTopic::where('id', $topic_id)->first();

        if ($action == "created") {
            $topic->update([
                'count_post' => $topic->count_post + 1
            ]);
        } else if ($action == "deleted") {
            $topic->update([
                'count_post' => $topic->count_post - 1
            ]);
        }
    }

    public function myPosts(Request $request)
    {
        if (!empty($this->abilityPolicyIndex)) {
            $this->authorize($this->abilityPolicyIndex, $this->model);
        }

        $this->requestData = $request;

        if ($ress = $this->__prepareCacheResult()) {
            return $ress;
        }

        $this->query = $this->model::query();
        $this->query = $this->query->where('created_by', Auth::id());

        $this->__prepareQueryRelationList();

        $this->__prepareQueryList();

        $this->__prepareQuerySearchAbleList();

        $this->__prepareQueryOptionsList();

        if ($ress = $this->__beforeList()) {
            return $ress;
        }

        $this->__prepareQuerySortOrderList();

        $this->__prepareQueryLimitList();

        $query = $this->__prepareQueryListType();

        $this->__prepareLoadRelation($query);

        return $this->__successList($query);
    }
}
