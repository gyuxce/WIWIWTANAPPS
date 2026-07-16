<?php

namespace App\Http\Controllers\Api\V1\Training;

use Illuminate\Support\Facades\Response;
use App\Http\Requests\Api\V1\Training\ApiUserFilesRequest;
use App\Http\Resources\V1\Base\UserFilesResource;
use App\Models\Base\File;
use App\Models\Base\User;
use App\Models\Base\UserFiles;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasFileTypeHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use SardineMicroservice\Repositories\SardineRepository;
use App\Http\Controllers\Api\V1\Sailfish\HasNotifications;

class UserFilesController extends BaseCrud
{

    use HasNotifications, HasFileTypeHelper;

    public $model = UserFiles::class;
    public $resource = UserFilesResource::class;
    public $storeValidator = ApiUserFilesRequest::class;
    public $updateValidator = ApiUserFilesRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $searchAble = ["slug"];
    public $cacheInMinute = 10;
    public $sardine;

    public function __construct()
    {
        $this->sardine = new SardineRepository();
    }

    public function __prepareDataStore($data)
    {
        $data['user_id'] = $data['user_id'] != null ? User::getId($data['user_id']) : null;
        $files = $this->uploadFile($data['file']);
        $data['file_id'] = $files  ? $files->id : null;
        $data['status'] = 1;

        return $data;
    }

    public function __prepareQueryList()
    {
        $this->query = $this->query->where('status', 1);
        return $this->query;
    }

    public function downloadFileUser($file_id)
    {
        try {
            $file = File::where('uuid', $file_id)->first();
            if (!$file) {
                abort(404, __('messages.file_not_found'));
            }
            $fileContent = file_get_contents($file->url);
            return Response::make($fileContent, 200, [
                'Content-Type' => 'application/octet-stream',
                'Content-Disposition' => 'attachment; filename="' . $file->filename . '"',
            ]);
        } catch (\Throwable $th) {
            return response()->json(
                ['message' => $th->getMessage()],
                500
            );
        }
    }

    public function deleteFileUser(Request $request, $file_id)
    {
        try {
            $file = File::where('uuid', $file_id)->first();
            if (!$file) {
                abort(404, __('messages.file_not_found'));
            }
            $data = UserFiles::whereHas('file', function ($q) use ($file_id) {
                        return $q->where('uuid', $file_id);
                    })->update([
                        'description' => $request->description,
                        'status' => 0,
                    ]);

            $userFile = UserFiles::where('file_id', $file->id)->with('user')->first();
            $notifdata = ["title" => "Hapus dokumen siswa", "body" => "Dokumen anda dihapus oleh [" . Auth::user()->name . "] dengan alasan [" .$request->deleted_reason."]", "data" => ["module" => "user-file", "user_file_id" => $userFile->uuid]];
            $this->__pushNotification($userFile->user, $notifdata);

            return response()->json(
                ['message' => 'Berhasil Hapus File']
            );
        } catch (\Throwable $th) {
            return response()->json(
                ['message' => $th->getMessage()],
                500
            );
        }
    }

    public function getUserFileStudent(Request $request)
    {
        if (!empty($this->abilityPolicyIndex)) {
            $this->authorize($this->abilityPolicyIndex, $this->model);
        }

        $this->requestData = $request;

        if ($ress = $this->__prepareCacheResult()) {
            return $ress;
        }

        $this->query = $this->model::query();
        $this->query = $this->query->where('user_id', Auth::id());

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

    public function storeUserFileMobile(ApiUserFilesRequest $request)
    {
        try {
            $files = $this->uploadFile($request->file('file'));
            if ($files) {
                $user_file = new UserFiles();
                $user_file->fill(
                    [
                        'user_id' => Auth::id(),
                        'description' => $request->description ?? '',
                        'slug' => $request->slug ?? '',
                        'type' => $request->type ?? '',
                        'status' => 1,
                        'file_id' => $files->id
                    ]
                );
                $user_file->save();
            }
            return response()->json(
                ['message' => 'Berhasil Upload File']
            );
        } catch (\Throwable $th) {
            return response()->json(
                ['message' => $th->getMessage()],
                500
            );
        }
    }

    protected function uploadFile($file)
    {
        $uploaded = $this->sardine->upload($file, [
            'folder' => 'files/wiwitan',
            'resize_width' => 1155,
            'visibility' => 'public',
            'file_name' => null,
        ]);

        $data['file_url'] = "https://storage.googleapis.com/" . config('filesystems.bucket') . $uploaded['data']['url'];

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

    public function checkTrainingPaymentDocumentRequirement()
    {
        $checkFileKtp = $this->isFileExist('KTP', Auth::user());
        $checkFileKtpWali = $this->isFileExist('KTP WALI', Auth::user());
        $checkFileSuratCicilan = $this->isFileExist('SURAT CICILAN PRIBADI', Auth::user());
        $checkFileSuratPelatihan = $this->isFileExist('SURAT PELATIHAN', Auth::user());

        $data = [
            'isCompleteTrainingLetterRequirement' => false,
            'isCompleteTrainingInstallmentDocsRequirement' => false,
        ];

        if ($checkFileSuratPelatihan) {
            $data['isCompleteTrainingLetterRequirement'] = true;
        }

        if ($checkFileKtp && $checkFileKtpWali && $checkFileSuratCicilan) {
            $data['isCompleteTrainingInstallmentDocsRequirement'] = true;
        }

        return response()->json([
            'data' => $data
        ]);
    }
}
