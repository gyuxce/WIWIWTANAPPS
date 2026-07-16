<?php

namespace SardineMicroservice\Http\Controllers\Api\V1;

use App\Services\BaseCrud\BaseCrud;
use DolphinMicroservice\Repositories\DolphinAuth;
use Illuminate\Http\Request;
use SardineMicroservice\Http\Requests\ChangeAvatarRequest;
use SardineMicroservice\Repositories\SardineRepository;
use App\Models\Base\File;
use Illuminate\Support\Facades\Log;

class FilesController extends BaseCrud
{
    public $updateValidator = ChangeAvatarRequest::class;

    public $sardine;

    public function __construct()
    {
        $this->model = config('dolphin.user_model');
        $this->resource = config('dolphin.user_resource');
        $this->sardine = new SardineRepository();
    }

    public function store(Request $request)
    {
        // max upload 15MB
        $request->validate([
            'file' => 'max:15360'
        ]);


        $uploaded = $this->sardine->upload($request->file('file'), [
            'folder' => 'files/wiwitan',
            // 'resize_height' => 866, // meperkecil file untuk kamrea 16MP
            'resize_width' => 1155,
            'visibility' => 'public',
            'file_name' => null,
        ]);

        Log::info(json_encode($uploaded)); 
        #$data['file_url'] = "https://storage.googleapis.com/" . config('filesystems.bucket') . $uploaded['data']['url'];
        $data['file_url'] = $uploaded['data']['url'];

        $files = new File();
        $files->fill([
            'name' => $uploaded["data"]['file_name'],
            'filename' => $uploaded["data"]['client_original_name'],
            'url' => $data['file_url'],
            'local_url' => $uploaded["data"]['path'],
            'adapter' => $uploaded["data"]['disk'],
            'size' => $uploaded["data"]['size'],
        ]);
        $files->save();

        return $files;
    }

    public function getFiles($id)
    {
        $data = File::getFirst($id, 'uuid');
        return response()->json(['data' => $data]);
    }
}
