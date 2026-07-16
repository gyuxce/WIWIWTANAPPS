<?php

namespace SardineMicroservice\Http\Controllers\Api\V1;

use App\Services\BaseCrud\BaseCrud;
use DolphinMicroservice\Repositories\DolphinAuth;
use Illuminate\Http\Request;
use SardineMicroservice\Http\Requests\ChangeAvatarRequest;
use SardineMicroservice\Repositories\SardineRepository;

class ProfileController extends BaseCrud
{
    public $updateValidator = ChangeAvatarRequest::class;

    public $sardine;

    public function __construct()
    {
        $this->model = config('62dolphin.user_model');
        $this->resource = config('62dolphin.user_resource');
        $this->sardine = new SardineRepository();
    }

    public function store(Request $req)
    {


        return $this->update($req, DolphinAuth::id());
    }

    public function __prepareDataUpdate($data)
    {
        $uploaded = $this->sardine->upload($this->requestData->file('file'), [
            'folder' => 'usr/' . DolphinAuth::id() . '/avatars',
            'resize_width' => 100,
            'visibility' => 'public',
            'file_name' => DolphinAuth::user()->avatar_url ?? null,
        ]);

        $data['avatar_url'] = $uploaded['data']['url'];
        return $data;
    }
}
