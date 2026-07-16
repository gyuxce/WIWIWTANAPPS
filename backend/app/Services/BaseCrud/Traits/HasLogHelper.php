<?php

namespace App\Services\BaseCrud\Traits;

use App\Models\Base\ActivityLog;
use App\Models\Base\Role;
use App\Models\Base\User;
use App\Models\Forum\ForumComment;
use App\Models\Forum\ForumPost;
use App\Models\Forum\ForumTopic;
use App\Models\Master\Certification;
use App\Models\Master\Cities;
use Exception;

trait HasLogHelper
{
    protected $change;
    /**
     * Register relation field for get name / title function
     *
     * @param [type] $old : old Data
     * @param [type] $new : new Data
     * @param string $action : "created", "updated", "deleted"
     * @return void
     */
    public function __insertLog($data, $action = "created", $dataChange = null)
    {
        # function insert log
        $this->change = null;
        if($action == "updated") {
            $this->change = $dataChange;
            $this->change = $this->__formatUpdateData();
        }

        $insert = [
            "module_uuid" => $data['uuid'] ?? null,
            "user_id" => $this->dolphinService::id(),
            "module" => app($this->model)->getTable(),
            "action" => $action,
            "description" => $this->__getDescription($action, $data),
            "data" => $this->change
        ];

        $log = ActivityLog::query();
        $log = $log->create($insert);
    }

    public function __wordTrans($action = "created")
    {
        # function get wording
        if ($action == 'updated') {
            $action = "Mengubah";
        } elseif ($action == 'deleted') {
            $action = "Menghapus";
        } elseif ($action == "created") {
            $action = "Membuat";
        }

        return $action;
    }

    public function __getDescription($action = "created", $data = null)
    {
        $transAction = $this->__wordTrans($action);
        $description = "";

        $module = ucfirst(str_replace("_", " ", app($this->model)->getTable()));

        $user = $this->dolphinService::user();

        if ($action == 'updated') 
        {
            $description = "[".ucfirst($user->name)."] ".$transAction." data ".$module." [".ucfirst($data['label'])."]";
        } 
        elseif ($action == 'deleted') 
        {
            $description = "[".ucfirst($user->name)."] ".$transAction." data ".$module." [".ucfirst($data['label'])."]";
        } 
        elseif ($action == "created") 
        {
            $description = "[".ucfirst($user->name)."] ".$transAction." ".$module." Baru";
        }
        else
        {
            $description = "[".ucfirst($user->name)."] ".$transAction." [".ucfirst($data['label'])."]";
        }

        return $description;
    }

    public function __formatUpdateData()
    {
        $change = [];

        unset($this->change['new']['updated_at']);
        unset($this->change['new']['created_at']);
        unset($this->change['old']['updated_at']);
        unset($this->change['old']['created_at']);
        foreach ($this->change['new'] as $key => $value) {
            if($this->change['old'][$key] != $value) {
                if(isset($this->__fieldRelations()[$key])) {
                    if($this->change['old'][$key] != null) {
                        $result = $this->__fieldRelations()[$key]['class']::select($this->__fieldRelations()[$key]['select'])->where('id', $this->change['old'][$key])->first();
                        if ($result) {
                            $change[$key]['old'] = $result->toArray();
                        }
                    } else {
                        $change[$key]['old'] = null;
                    }

                    if($this->change['new'][$key] != null) {
                        $result = $this->__fieldRelations()[$key]['class']::select($this->__fieldRelations()[$key]['select'])->where('id',$value)->first();
                        if ($result) {
                            $change[$key]['new'] = $result->toArray();
                        }
                    } else {
                        $change[$key]['new'] = null;

                    }

                } else {
                    $change[$key]['old'] = $this->change['old'][$key];
                    $change[$key]['new'] = $value;
                }
            }
        }

        return $change;
    }

    public function __fieldRelations()
    {
        return [
            "role_id" => ['class' => Role::class, 'select' => ["uuid", "name"]],
            "city_id" => ['class' => Cities::class, 'select' => ["uuid", "name"]],
            "post_id" => ['class' => ForumPost::class, 'select' => ["uuid", "title"]],
            "user_id" => ['class' => User::class, 'select' => ["uuid", "name"]],
            "comment_id" => ['class' => ForumComment::class, 'select' => ["uuid", "comment"]],
            "certificate_id" => ['class' => \App\Models\Base\File::class, 'select' => ["uuid", "name"]],
            "cv_id" => ['class' => \App\Models\Base\File::class, 'select' => ["uuid", "name"]],
            "topic_id" => ['class' => ForumTopic::class, 'select' => ["uuid", "name"]],
            "certification_id" => ['class' => Certification::class, 'select' => ["uuid", "name"]],
            "cert_file_id" => ['class' => \App\Models\Base\File::class, 'select' => ["uuid", "name"]],
        ];
    }
}