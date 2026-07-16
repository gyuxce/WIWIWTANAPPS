<?php

namespace App\Http\Controllers\Api\V1\Forum;

use Illuminate\Support\Facades\Auth;
use App\Http\Resources\V1\Forum\ForumLikeResource;
use App\Http\Requests\Api\V1\Forum\ApiForumLikeRequest;
use App\Models\Forum\ForumLike;
use App\Models\Forum\ForumPost;
use App\Models\Forum\ForumComment;
use App\Models\Base\User;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;

class ForumLikeController extends BaseCrud
{
    use HasLogHelper;
    public $model = ForumLike::class;
    public $resource = ForumLikeResource::class;
    public $searchAble = ["description"];

    public $storeValidator = ApiForumLikeRequest::class;
    public $updateValidator = ApiForumLikeRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareDataStore($data)
    {
        $post_id = null;
        $comment_id = null;

        if (isset($data['post_id'])) {
            $post_id = ForumPost::getId($data['post_id']);
            $like_post = ForumLike::where('user_id', Auth::id())->where('post_id', $post_id)->first();
            if ($like_post) {
                abort(404, __('messages.post_liked_validation'));
            }
        }

        if (isset($data['comment_id'])) {
            $comment_id = ForumComment::getId($data['comment_id']);
            $like_comment = ForumLike::where('user_id', Auth::id())->where('comment_id', $comment_id)->first();
            if ($like_comment) {
                abort(404, __('messages.comment_liked_validation'));
            }
        }

        $data['user_id'] = Auth::id();
        $data['post_id'] = $post_id;
        $data['comment_id'] = $comment_id;
        
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
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->requestData->get('post_id') != null ? $this->row->post->title : $this->row->comment->comment];
        $this->__insertLog($dataLog, "menyukai", null);

        # update count_like in forum post
        if ($this->row->post_id) {
            $post = ForumPost::where('id', $this->row->post_id)->where('is_publish', 1)->first();
            if (!$post) {
                abort(404, __('messages.post_unpublish_validation'));
            }
            
            $post->update([
                'count_like' => $post->count_like + 1
            ]);
        }

        # update count_like in forum comment
        if ($this->row->comment_id) {
            $comment = ForumComment::where('id', $this->row->comment_id)->where('is_publish', true)->first();
            if (!$comment) {
                abort(404, __('messages.comment_unpublish_validation'));
            }

            $comment->update([
                'count_like' => $comment->count_like + 1
            ]);
        }
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->requestData->get('post_id') != null ? $this->row->post->title : $this->row->comment->comment];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function __beforeDestroy()
    {  
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" =>   $this->row->post != null ? $this->row->post->title : $this->row->comment->comment];
        $this->__insertLog($dataLog, "tidak menyukai", null);

         # update count_like in forum post
         if ($this->row->post_id) {
            $like = ForumLike::where('user_id', Auth::id())->where('post_id', $this->row->post_id)->first();
            if ($like) {
                $post = ForumPost::where('id', $this->row->post_id)->first();
                if (!$post) {
                    abort(404, __('messages.post_unpublish_validation'));
                }

                $post->update([
                    'count_like' => $post->count_like - 1
                ]);
            }
        }

        # update count_like in forum comment
        if ($this->row->comment_id) {
            $like = ForumLike::where('user_id', Auth::id())->where('comment_id', $this->row->comment_id)->first();
            if ($like) {
                $comment = ForumComment::where('id', $this->row->comment_id)->first();
                if (!$comment) {
                    abort(404, __('messages.comment_unpublish_validation'));
                }

                $comment->update([
                    'count_like' => $comment->count_like - 1
                ]);        
            }
        }
    }
}
