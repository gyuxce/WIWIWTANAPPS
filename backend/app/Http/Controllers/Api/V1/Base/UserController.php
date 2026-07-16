<?php

namespace App\Http\Controllers\Api\V1\Base;

use App\Constants\Training\InterviewStatusConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\UserExamTypeConstant;
use App\Constants\UserAccountAdapterConstant;
use App\Http\Requests\Api\V1\Base\ApiAccountLinkRequest;
use App\Http\Requests\Api\V1\Base\ApiUpdateProfileMobileRequest;
use App\Models\Base\User;
use App\Http\Resources\V1\Base\UserResource;
use App\Http\Requests\Api\V1\Base\ApiUserRequest;
use App\Http\Requests\Api\V1\Base\ApiUpdateProfileRequest;
use App\Http\Requests\Api\V1\Base\ApiUpdateUserRequest;
use App\Http\Resources\V1\Base\UserProgressDetailResource;
use App\Models\Base\File;
use App\Models\Master\Cities;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Illuminate\Support\Facades\Hash;
use App\Models\Base\Role;
use App\Models\Base\UserFiles;
use App\Models\Training\Course;
use App\Models\Training\UserExamQuestion;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class UserController extends BaseCrud
{
    use HasLogHelper;
    public $model = User::class;
    public $resource = UserResource::class;
    public $searchAble = ["name"];

    public $storeValidator = ApiUserRequest::class;
    public $updateValidator = ApiUpdateUserRequest::class;
    public $updateProfileValidator = ApiUpdateProfileRequest::class;
    public $updateProfileMobileValidator = ApiUpdateProfileMobileRequest::class;
    public $accountLinkValidator = ApiAccountLinkRequest::class;

    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareDataStore($data)
    {
        $data['name_alias'] = $data['name'];
        if (isset($data['password']) && filled($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        if (isset($data['city_id']) && filled($data['city_id'])) {
            $data['city_id'] = Cities::getId($data['city_id']);
        }
        if (isset($data['role_id']) && filled($data['role_id'])) {
            $data['role_id'] = Role::getId($data['role_id']);
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

    public function __beforeDestroy()
    {
        $this->row->update([
            "email" => $this->row->email . "-deleted-" . $this->row->id,
            "username" => $this->row->username . "-deleted-" . $this->row->id
        ]);

        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "deleted", null);
    }


    public function activateAccount($uuid)
    {
        $user = User::getFirst($uuid);
        if (!$user) {
            abort(404, __('messages.user_not_found'));
        }

        $data = [
            "is_active" => true,
            "count_login_attempt" => 0
        ];
        if (empty($user->email_verified_at)) {
            $data["email_verified_at"] = now();
        }
        
        $user->update($data);

        return view('pages.activation.index');
    }

    public function userInactivateAccount()
    {
        $user = User::where('id', Auth::id())->first();
        if (!$user) {
            abort(404, __('messages.user_not_found'));
        }

        if ($user->is_active == false) {
            return response()->json([
                'success' => false,
                'message' => 'Akun anda sudah tidak aktif',
            ], 404);
        }
        $user->update([
            "is_active" => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berhasil menonaktifkan akun',
        ]);
    }

    public function updateProfile()
    {
        $req = app($this->updateProfileValidator);
        $reqProfilePic = $req->input('profile_pic_id');
        $reqName = $req->input('name');

        $user = User::where('id', Auth::id())->first();
        if (!$user) {
            abort(404, __('messages.user_not_found'));
        }

        if ($reqProfilePic) {
            $user->update([
                "profile_pic_id" => File::getId($reqProfilePic),
            ]);
        }

        if ($reqName) {
            $user->update([
                "name" => $reqName,
            ]);
        }

        return $this->__success();
    }

    public function updateProfileMobile()
    {
        $req = app($this->updateProfileMobileValidator);
        $reqProfilePic = $req->input('profile_pic_id');
        $reqAddress = $req->input('address');
        $reqCity = $req->input('city_id');
        $reqName = $req->input('name');
        $reqJoinReason = $req->input('join_reason');
        $reqNameAlias = $req->input('name_alias');
        $reqPhone = $req->input('phone');
        $user = User::where('id', Auth::id())->first();
        if (!$user) {
            abort(404, __('messages.user_not_found'));
        }

        if ($reqAddress) {
            $user->address = $reqAddress;
        }

        if ($reqProfilePic) {
            $user->profile_pic_id = File::getId($reqProfilePic);
        }

        if ($reqCity) {
            $user->city_id = Cities::getId($reqCity);
        }

        if ($reqName) {
            $user->name = $reqName;
        }

        if ($reqJoinReason) {
            $user->join_reason = $reqJoinReason;
        }

        if ($reqNameAlias) {
            $user->name_alias = $reqNameAlias;
        }

        if ($reqPhone) {
            $user->phone = $reqPhone;
        }

        //$user->update($req->validated());
        $user->save();

        return $this->__success();
    }

    public function deleteFileUser(Request $request, $file_id)
    {
        try {
            $data = UserFiles::whereHas('file', function ($q) use ($file_id) {
                return $q->where('uuid', $file_id);
            })->update([
                'description' => $request->description,
                'status' => 0,
            ]);
            $file = File::where('uuid', $file_id)->firstOrFail();
            UserExamQuestion::where('a_body_file_id', $file->id)->update([
                'a_body_file_id' => null
            ]);
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
            $ress->interview_status_label = InterviewStatusConstant::LIST[$ress->interview_status] ?? null;
            $ress->program_type = TrainingProgramConstant::LIST[$ress->training_program] ?? null;
            $ress->date_registered = $row->created_at ?  \Carbon\Carbon::parse($row->created_at)->isoFormat('D MMMM YYYY') : '';
            $ress->is_active = User::LABEL_STATUS_STUDENT[$row->is_active] ?? null;
            return $ress;
        });

        $filtername = 'Siswa';

        $fields = [
            "name",
            "email",
            "city->name",
            "date_registered",
            "is_active",
        ];
        $headings = [
            "Nama Siswa",
            "Email",
            "Domisili",
            "Tanggal Daftar",
            "Status",
        ];

        $filename = $filtername . "_" . \Carbon\Carbon::now()->format('Ymd') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }
    public function exportInterview(\Illuminate\Http\Request $request)
    {
        $this->requestData = $request;
        $this->query = $this->model::query();
        $this->query = $this->__prepareQueryList();
        $this->query = $this->__prepareQuerySearchAbleList();
        $this->query = $this->__prepareQueryOptionsList();
        $data = $this->query->get();

        $data = $data->map(function ($row) {
            $ress = $row;
            $ress->interview_status_label = InterviewStatusConstant::LIST[$ress->interview_status] ?? null;
            $ress->program_type = TrainingProgramConstant::LIST[$ress->training_program] ?? null;
            $ress->date_registered = $row->created_at ?  \Carbon\Carbon::parse($row->created_at)->isoFormat('D MMMM YYYY') : '';
            $ress->is_active = User::LABEL_STATUS_STUDENT[$row->is_active] ?? null;
            return $ress;
        });


        $filtername = 'Interview Siswa';
        $fields = [
            "name",
            "program_type",
            "interview_count",
            "interview_status_label",
        ];
        $headings = [
            "Nama Siswa",
            "Program Pelatihan",
            "Total Wawancara",
            "Status Kelulusan",
        ];

        $filename = $filtername . "_" . \Carbon\Carbon::now()->format('Ymd') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }

    public function detailProgress($id)
    {

        $user =
            User::with(
                [
                    'pratestLanguage',
                    'pratestCharacter',
                    'pratestQna',
                    'userBatch.transactionAdministration',
                    'userBatch.transactionTraining',
                    'certifications',
                    'userArticle' => function ($q) {
                        $q->with(['article' => function ($q) {
                            $q->with(['course']);
                        }]);
                    }
                ]
            )
            ->where('uuid', $id)->first();
        $user->courses =
            Course::withCount(['articles as materi_count', 'articles as materi_count_progress' => function ($q) use ($user) {
                $q->whereHas('user_article', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            }])->get();
        return response()->json([
            'data' => new UserProgressDetailResource($user)
        ]);
    }

    public function connectAccount(Request $request)
    {
        $req = app($this->accountLinkValidator);

        $user = User::where('id', Auth::id())->first();
        if (!$user) {
            abort(404, __('messages.user_not_found'));
        }

        $socialMediaAccounts = ['google_id', 'facebook_id', 'apple_id'];
        foreach ($socialMediaAccounts as $field) {
            if (isset($request->$field)) {
                $checkUser = User::where($field, $request->$field)->first();
                if ($checkUser) {
                    abort(404, __('User with that id is exist'));
                }
                $user->update([$field => $request->$field]);
            }
        }

        if (isset($request->adapter)) {
            switch ($request->adapter) {
                case UserAccountAdapterConstant::GOOGLE:
                    $user->update(['google_id' => null]);
                    break;
                case UserAccountAdapterConstant::FACEBOOK:
                    $user->update(['facebook_id' => null]);
                    break;
                case UserAccountAdapterConstant::APPLE:
                    $user->update(['apple_id' => null]);
                    break;
            }
        }

        return response()->json([
            'data' => $user,
        ], Response::HTTP_OK);
    }

    public function filter(Request $request) {
        $this->requestData = $request;

        if ($ress = $this->__prepareCacheResult()) {
            return $ress;
        }

        $this->query = $this->model::query();

        $this->__prepareQueryRelationList();

        $this->__prepareQueryList();

        $this->__prepareQuerySearchAbleList();

        $this->__prepareQueryOptionsList();

        $this->__prepareQuerySortOrderList();

        $this->__prepareQueryLimitList();

        $query = $this->__prepareQueryListType();

        $this->__prepareLoadRelation($query);

        return $this->__successList($query);
    }
}
