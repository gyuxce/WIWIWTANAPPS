<?php

namespace App\Http\Controllers\Api\V1\Forum;

use App\Http\Controllers\Api\V1\Sailfish\HasNotifications;
use Illuminate\Support\Facades\Auth;
use App\Constants\ForumCommentConstant;
use App\Models\Forum\ForumComment;
use App\Http\Resources\V1\Forum\ForumCommentResource;
use App\Http\Requests\Api\V1\Forum\ApiForumCommentRequest;
use App\Models\Forum\ForumPost;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use App\Constants\Forum\ForumCommentStatusReport;

class ForumCommentController extends BaseCrud
{
    use HasLogHelper, HasNotifications;
    public $model = ForumComment::class;
    public $resource = ForumCommentResource::class;
    public $storeValidator = ApiForumCommentRequest::class;
    public $updateValidator = ApiForumCommentRequest::class;
    public $defaultOrder = "id";
    public $defaultSort = 'desc';
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareQueryList()
    {
        if ($this->requestData->get('parent_id') != null) {
            $this->query = $this->query->where('parent_id', $this->model::getId($this->requestData->get('parent_id')));
        } else {
            $this->query = $this->query->whereNull('parent_id');
        }
        if ($this->requestData->get('post_id') != null) {
            $this->query = $this->query->where('post_id', ForumPost::getId($this->requestData->get('post_id')));
        }
        return $this->query;
    }

    public function __prepareDataStore($data)
    {
        $data["user_id"] = Auth::id();
        $data["parent_id"] = isset($data["parent_id"]) ? $this->model::getId($data["parent_id"]) : null;
        $data["post_id"] = ForumPost::getId($data["post_id"]);
        $data["is_publish"] = ForumCommentConstant::PUBLISH;
        return $data;

    }

    public function __prepareDataUpdate($data)
    {
        $data = $this->__prepareDataStore($data);
        $data["is_update"] = 1;
        $data["is_publish"] = ForumCommentConstant::PUBLISH;
        unset($data['created_by']);
        return $data;
    }

    public function __beforeDestroy()
    {
        $post = $this->row->post;
        $totalComment = $post->comments()->count();
        $post->update([
            'count_comment' => ((int) $totalComment - 1),
            'status_report' => ForumCommentStatusReport::STATUS_DELETED,
        ]);
        
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->comment];
        $this->__insertLog($dataLog, "deleted", null);
    }

    public function __afterStore()
    {
        $post = ForumPost::getFirst($this->requestData->get("post_id"));
        $totalComment = $post->comments()->count();
        $post->update(['count_comment' => $totalComment]);

        $notifdata = [
            "title" => "Comment",
            "body" => "[" . $post->title . "] Anda mendapatkan komentar dari [" . $this->row->user->name . "]",
            "data" => [
                "module" => "forum-comment",
                "post_id" => $post->uuid,
                "comment_id" => $this->row->uuid,
                "comment" => $this->row->comment
            ]
        ];
        
        $notifuser = null;

        # send notification for post pubbish
        if ($post->user->id != $this->row->user->id and $this->row->parent_id == null) {
            $notifuser = $post->user;
        }

        # if parent is not null send for parent commentar
        if ($this->row->parent_id != null) {
            $dataParent = $this->model::getFirst($this->row->parent_id, 'id');
            $notifdata["body"] = "[" . $this->row->user->name . "] membalas komentar anda";
            $notifdata["data"] = ["module" => "forum-comment", "post_id" => $post->uuid, "comment_id" => $this->row->uuid, "comment" => $this->row->comment, "parent_id" => $dataParent->uuid];

            $notifuser = $dataParent->user;
        }

        $this->__pushNotification($notifuser, $notifdata);

        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->comment];
        $this->__insertLog($dataLog, "created", null);
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->comment];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function __prepareQueryRowDestroy()
    {
        $user = Auth::user();
        if ($user->role == null) {
            $this->query = $this->query->where('created_by', $user->id);
        }
    }

    public function __prepareQueryRowUpdate()
    {
        $this->__prepareQueryRowDestroy();
    }

    public function __beforeUpdate()
    {
        # validation date 
        $createdAt = $this->row->created_at;
        $date1 = new \DateTime();
        $date2 = new \DateTime($createdAt);

        $diff = $date2->diff($date1);

        $hours = $diff->h + ($diff->days * 24);

        if ($hours > 24) {
            abort(400, "Komentar tidak dapat di update karena lebih dari 24 jam.");
        }
    }
}