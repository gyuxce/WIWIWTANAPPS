<?php

namespace App\Http\Controllers\Api\V1\Forum;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Constants\Forum\ForumReportStatusConstant;
use App\Constants\Forum\ForumReportTypeConstant;
use App\Http\Controllers\Api\V1\Sailfish\HasNotifications;
use App\Http\Resources\V1\Forum\ForumReportResource;
use App\Http\Requests\Api\V1\Forum\ApiForumReportRequest;
use App\Models\Base\User;
use App\Models\Forum\ForumReport;
use App\Models\Forum\ForumPost;
use App\Models\Forum\ForumComment;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;

class ForumReportController extends BaseCrud
{
    use HasLogHelper, HasNotifications;
    public $model = ForumReport::class;
    public $resource = ForumReportResource::class;
    public $searchAble = ["notes"];

    public $storeValidator = ApiForumReportRequest::class;
    public $updateValidator = ApiForumReportRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareQueryList()
    {
        if (isset($this->requestData['siswa_role'])) {
            $rolenull = [];
            $role = [];

            foreach ($this->requestData['siswa_role'] as $value) {
                if ($value == 'siswa') {
                    array_push($rolenull, $value);
                } else {
                    array_push($role, $value);
                }
            }

            $this->query = $this->query->where(function ($query) use ($rolenull, $role) {
                $query->whereHas('post.user', function ($q) use ($rolenull, $role) {
                    if (count($rolenull) > 0 && count($role) > 0) {
                        $q->where(function ($qq) use ($role) {
                            $qq->whereNull('role_id')
                               ->orWhereHas('role', function ($qq) use ($role) {
                                   $qq->whereIn('uuid', $role);
                               });
                        });
                    } else {
                        if (count($rolenull) > 0) {
                            $q->whereNull('role_id');
                        }
                
                        if (count($role) > 0) {
                            $q->whereHas('role', function ($qq) use ($role) {
                                $qq->whereIn('uuid', $role);
                            });
                        }
                    }
                });
            
                $query->orWhereHas('comment.user', function ($q) use ($rolenull, $role) {
                    if (count($rolenull) > 0 && count($role) > 0) {
                        $q->where(function ($qq) use ($role) {
                            $qq->whereNull('role_id')
                               ->orWhereHas('role', function ($qq) use ($role) {
                                   $qq->whereIn('uuid', $role);
                               });
                        });
                    } else {
                        if (count($rolenull) > 0) {
                            $q->whereNull('role_id');
                        }
                
                        if (count($role) > 0) {
                            $q->whereHas('role', function ($qq) use ($role) {
                                $qq->whereIn('uuid', $role);
                            });
                        }
                    }
                });
            });
        }
        $this->query = $this->query->groupBy('post_id')->groupBy('comment_id');

        return $this->query;
    }

    public function __prepareDataStore($data)
    {
        $data['user_id'] = Auth::id();
        $data['post_id'] = isset($data['post_id']) ? ForumPost::getId($data['post_id']) : null;
        $data['comment_id'] = isset($data['comment_id']) ? ForumComment::getId($data['comment_id']) : null;

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
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->notes];
        $this->__insertLog($dataLog, "melaporkan", null);

        # update count_report in forum post
        if ($this->row->post_id) {
            $post = ForumPost::where('id', $this->row->post_id)->where('is_publish', 1)->first();
            if (!$post) {
                abort(404, __('messages.post_unpublish_validation'));
            }
            
            $post->update([
                'count_report' => $post->count_report + 1
            ]);
        }

        # update count_report in forum comment
        if ($this->row->comment_id) {
            $comment = ForumComment::where('id', $this->row->comment_id)->where('is_publish', true)->first();
            if (!$comment) {
                abort(404, __('messages.comment_unpublish_validation'));
            }

            $comment->update([
                'count_report' => $comment->count_report + 1
            ]);
        }
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->notes];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function __beforeDestroy()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->notes];
        $this->__insertLog($dataLog, "menghapus", null);

        # update count_like in forum post
        if ($this->row->post_id) {
            $report = ForumReport::where('user_id', Auth::id())->where('post_id', $this->row->post_id)->first();
            if ($report) {
                $post = ForumPost::where('id', $this->row->post_id)->first();
                if (!$post) {
                    abort(404, __('messages.post_unpublish_validation'));
                }

                $post->update([
                    'count_report' => $post->count_report - 1
                ]);
            }
        }

        # update count_like in forum comment
        if ($this->row->comment_id) {
            $report = ForumReport::where('user_id', Auth::id())->where('comment_id', $this->row->comment_id)->first();
            if ($report) {
                $comment = ForumComment::where('id', $this->row->comment_id)->first();
                if (!$comment) {
                    abort(404, __('messages.comment_unpublish_validation'));
                }

                $comment->update([
                    'count_report' => $comment->count_report - 1
                ]);        
            }
        }
    }

    public function export(\Illuminate\Http\Request $request)
    {
        $this->requestData = $request;
        $this->query = $this->model::query();
        $this->query = $this->__prepareQueryList();
        $this->query = $this->__prepareQuerySearchAbleList();
        $this->query = $this->__prepareQueryOptionsList();
        $data = $this->query->get();

        $data = $data->map(function ($row) {
            $ress = $row;
            $ress->status = ForumReportStatusConstant::LIST[$row->status] ?? null;
            $ress->type = ForumReportTypeConstant::LIST[$row->type] ?? null;
            return $ress;
        });

        $fields = [
            "user->name",
            "user->email",
            "post->title",
            "post->user->name",
            "comment->comment",
            "comment->user->name",
            "notes",
            "type",
            "status",
        ];
        $headings = [
            "Reporter",
            "Email Reporter",
            "Post",
            "Post Publish By",
            "Comment",
            "Comment By",
            "Notes",
            "Type",
            "Status",
        ];


        $filename = app($this->model)->getTable() . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }

    public function reportWarn(Request $request)
    {  
        $forumReport = ForumReport::where('uuid', $request->id)->with('user')->first();

        # send notification
        $notifdata = ["title" => "Post", "body" => $request->notif_message, "data" => ["module" => "forum-report", "report_id" => $forumReport->uuid]];
        $this->__pushNotification($forumReport->user, $notifdata);        
        
        return response()->json([
            "status" => "success"
        ], 200);
    }
}
