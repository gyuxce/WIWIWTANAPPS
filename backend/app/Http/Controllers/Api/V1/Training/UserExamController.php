<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Constants\LastEducationConstant;
use App\Constants\PhaseSettingConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\PratesStatusConstant;
use App\Constants\Training\UserExamStatusConstant;
use App\Constants\UserFilesConstant;
use App\Http\Requests\Api\V1\Training\ApiReminderPratestLanguageRequest;
use App\Models\Training\UserExam;
use App\Http\Resources\V1\Training\UserExamResource;
use App\Http\Requests\Api\V1\Training\ApiUserExamRequest;
use App\Http\Resources\V1\Training\ExamScheduleResource;
use App\Models\Base\File;
use App\Models\Base\User;
use App\Models\Base\UserFiles;
use App\Models\Training\ExamSchedule;
use App\Models\Training\ExamTemplate;
use App\Models\Training\ExamTemplateItem;
use App\Models\Training\UserExamQuestion;
use App\Models\Training\UserSessions;
use App\Repositories\UserExamRepository;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\V1\Sailfish\HasNotifications;

class UserExamController extends BaseCrud
{

    use HasNotifications;

    public $model = UserExam::class;
    public $resource = UserExamResource::class;
    public $storeValidator = ApiUserExamRequest::class;
    public $updateValidator = ApiUserExamRequest::class;
    public $reminderPratestLanguageValidator = ApiReminderPratestLanguageRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "user_exams.uuid";
    public $cacheInMinute = 10;
    public $repo;
    public $searchAble = ["user.name"];

    public function __construct()
    {
        $this->repo = new UserExamRepository();
    }

    public function getUserExamProgress()
    {
        try {
            $data = UserExam::with(['progress.sesi.userStartedSession', 'progress.currentSessionLanguage'])
                ->whereHas('user', function ($q) {
                    return $q->where('id', Auth::id());
                })
                ->whereHas('template', function ($q) {
                    return $q->where('type', 1);
                })
                ->get();

            $progress = ['data' => UserExamResource::collection($data)];
            //return response()->json(UserExamResource::collection($data));
            return $progress;
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }



    public function __prepareQueryList()
    {
        $filterType = request('status_pra_test');
        $filterTypePratest = request('type_pratest');

        if ($filterTypePratest == 'language') {
            $this->query = $this->query->where('user_exams.template_id', ExamTemplateConstant::PRATEST_LANGUAGE);
        } else if ($filterTypePratest == 'qna') {
            $filter = explode(',', $filterType);
            $this->query = $this->repo->filterStatusPratest($filter);
            $this->query = $this->query->where('user_exams.template_id', ExamTemplateConstant::PRATEST_QNA);
        } else if ($filterTypePratest == 'character') {
            $this->query = $this->query->where('user_exams.template_id', ExamTemplateConstant::PRATEST_CHARACTER);
        }

        return $this->query;
    }

    public function __prepareQueryRowShow()
    {
        $filterTypePratest = request('type_pratest');
        if ($filterTypePratest == 'qna') {

            $this->query = $this->query->select('user_exams.*', DB::raw('IF(exam_test_bahasa.id IS NOT NULL AND exam_test_karakter.id IS NOT NULL, 2, IF(exam_test_bahasa.id IS NOT NULL, 1, 0)) AS status_pr'))
                ->leftjoin('user_exams as exam_test_bahasa', function ($join) {
                    $join->on('user_exams.user_id', '=', 'exam_test_bahasa.user_id')
                        ->where('exam_test_bahasa.template_id', '=', ExamTemplateConstant::PRATEST_LANGUAGE)
                        ->where('exam_test_bahasa.status', '=', UserExamStatusConstant::SELESAI);
                })
                ->leftjoin('user_exams as exam_test_karakter', function ($join) {
                    $join->on('user_exams.user_id', '=', 'exam_test_karakter.user_id')
                        ->where('exam_test_karakter.template_id', '=', ExamTemplateConstant::PRATEST_CHARACTER)
                        ->where('exam_test_karakter.status', '=', UserExamStatusConstant::SELESAI);
                });
        }
    }

    public function __afterUpdate()
    {
        $req = $this->requestData;

        // kalau dia tes karakter
        if (isset($req['file_tes_karakter_id'])) {
            $file = File::where('uuid', $req['file_tes_karakter_id'])->firstOrFail();
            UserExamQuestion::updateOrCreate(
                ['user_exam_id' => $this->row->id],
                ['a_body_file_id' => $file->id]
            );
            UserFiles::updateOrCreate(
                ['file_id' => $file->id],
                [
                    'type' => UserFilesConstant::TES_KARAKTER,
                    'slug' => 'TES KARAKTER',
                    'description' => 'Hasil Tes Karakter',
                    'status' =>  UserExamStatusConstant::SELESAI,
                    'file_id' => $file->id,
                    'user_id' => $this->row->user_id
                ]
            );
        }

        // kalau qna
        if (isset($req['exam_schedules']) && count($req['exam_schedules']) > 0) {
            $exam_schedule_ids = collect($req['exam_schedules'])->filter(function ($schedule) {
                return $schedule['id'];
            })->pluck('id')->toArray();
            if (count($exam_schedule_ids) == 0) {
                ExamSchedule::where('user_exam_id', $this->row->id)->delete();
            } else {
                ExamSchedule::whereNotIn('uuid', $exam_schedule_ids)->delete();
            }
            foreach ($req['exam_schedules'] as $value) {
                ExamSchedule::updateOrCreate(
                    ['uuid' => $value['id']],
                    [
                        'start_date' => \Carbon\Carbon::parse($value['start_date']),
                        'user_exam_id' =>  $this->row->id
                    ]
                );
            }

            $this->row->update(['jadwal_tersedia' => count($req['exam_schedules'])]);
        }

        // jika qna status lulus
        if ($this->row->template_id == ExamTemplateConstant::PRATEST_QNA) {
            if ($this->row->status == UserExamStatusConstant::LULUS) {
                User::where('id', $this->row->user_id)->update([
                    'last_phase' => PhaseSettingConstant::PHASE_PAYMENT
                ]);
            }
        }
    }


    public function export(Request $request)
    {
        Carbon::setLocale('id');
        $this->requestData = $request;
        $this->query = $this->model::query();
        $this->query = $this->__prepareQueryList();
        $this->query = $this->query->with('user');
        $this->query = $this->__prepareQuerySearchAbleList();
        $this->query = $this->__prepareQueryOptionsList();
        $data = $this->query->get();
        $data = $data->map(function ($row) {
            $ress = $row;
            $ress->user_name = $row->user ? $row->user->name : '-';
            $ress->status_pr_label = PratesStatusConstant::LIST[$row->status_pr] ?? null;
            $ress->status_label = UserExamStatusConstant::LIST[$row->status] ?? null;
            $ress->tgl_submit = $row->finished_at ?  \Carbon\Carbon::parse($row->finished_at)->isoFormat('D MMMM YYYY') : '';
            $ress->file_tes_karakter = $row->fileTesCharacter ? $row->fileTesCharacter->url : null;
            $ress->jadwal_pilihan_siswa = $row->exam_schedule_active ? \Carbon\Carbon::parse($row->exam_schedule_active->start_date)->isoFormat('D MMMM YYYY, H:mm') : '';

            return $ress;
        });
        $filterTypePratest = request('type_pratest') ?? 'language';



        $fieldsHeading = $this->exportFieldHeading($filterTypePratest);
        if ($filterTypePratest  == "character") {
            $filterTypePratest = "Hasil Tes Karakter Siswa";
        } else if ($filterTypePratest  == "qna") {
            $filterTypePratest = "Hasil Tes QnA Siswa";
        } else {
            $filterTypePratest = "Hasil Tes Bahasa Siswa";
        }
        $filename = $filterTypePratest . "_" . \Carbon\Carbon::now()->format('Ymd') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fieldsHeading[0], $fieldsHeading[1]), $filename);
    }

    protected function exportFieldHeading($filterTypePratest)
    {
        $fields = [
            "user_name",
            "tgl_submit",
            "weight_total",
            "status_label",
        ];
        $headings = [
            "Nama Siswa",
            "Tanggal Submit",
            "Nilai",
            "Status",
        ];

        if ($filterTypePratest == 'character') {
            $headings[1] = 'Lampiran';
            $fields[1] = 'file_tes_karakter';
        }
        if ($filterTypePratest == 'qna') {
            $headings[1] = 'Status Pra Tes';
            $headings[2] = 'Jadwal Tersedia';
            $headings[3] = 'Jadwal Pilihan Siswa';
            $headings[4] = 'Status Kelulusan';

            $fields[1] = "status_pr_label";
            $fields[4] = "status_label";
            $fields[3] = "jadwal_pilihan_siswa";
            $fields[2] = "jadwal_tersedia";
        }

        return [$fields, $headings];
    }

    public function mobileSetShceduleQna(Request $request, $id)
    {
        try {
            $user_exam = UserExam::where('uuid', $id)
                ->where('user_id', Auth::id())
                ->first();
            if (!$user_exam) {
                throw new \Exception('User Exam Not Found');
            }
            $schedule = ExamSchedule::where('uuid', $request->user_exam_schedule_id)
                ->where('user_exam_id', $user_exam->id)
                ->first();

            if (!$schedule) {
                throw new \Exception('Schedule Not Found');
            }

            $user_exam->update([
                'user_exam_schedule_id' => $schedule->id
            ]);
            return response()->json(
                [
                    'message' => 'Berhasil Setting Jadwal',
                    'data' => new ExamScheduleResource($schedule)
                ]
            );
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function mobileShowSchedule($id)
    {
        try {
            $user_exam = UserExam::with(['exam_schedule_active', 'exam_schedules'])
                ->where('uuid', $id)
                ->where('user_id', Auth::id())
                ->first();
            if (!$user_exam) {
                throw new \Exception('User Exam Not Found');
            }
            return response()->json(
                new UserExamResource($user_exam)
            );
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function mobileSetSessionLanguage(Request $request)
    {
        try {
            $sesi = ExamTemplateItem::where('uuid', $request->sesi_question_id)->where('is_header', true)->first();
            if (!$sesi) {
                throw new \Exception('Sesi not found');
            }
            User::where('id', Auth::id())->update([
                'current_sesi_language_id' => $sesi->id
            ]);
            $user_session = UserSessions::where('exam_template_item_id', $sesi->id)->where('user_id', Auth::id())->first();
            if ($user_session) {
                $user_session->update(
                    [
                        'started_at' => $request->started_at ?? ''
                    ]
                );
            } else {
                $user_session = UserSessions::create([
                    'user_id' => Auth::id(),
                    'started_at' => $request->started_at ?? '',
                    'exam_template_item_id' => $sesi->id
                ]);
            }
            return response()->json(
                [
                    'message' => 'Success set session'
                ]
            );
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function mobileStartExam(Request $request)
    {
        try {
            $user_exam = UserExam::where('uuid', $request->user_exam_id)->first();
            if (!$user_exam) {
                throw new \Exception('User exam not found');
            }
            $user_exam->update([
                'started_at' => $request->started_at,
                'status' => UserExamStatusConstant::MENUNGGUTEST
            ]);
            return response()->json(
                [
                    'message' => 'Success set progerss'
                ]
            );
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function mobileFinishedPratest(Request $request)
    {
        try {
            $user_exam = UserExam::where('uuid', $request->user_exam_id)->first();
            if (!$user_exam) {
                throw new \Exception('User exam not found');
            }
            $this->repo->calculateResult($user_exam->id);
            $user_exam->update([
                'status' => $request->status,
                'finished_at' => $request->finished_at,
                'started_at' => $request->started_at,
            ]);
            return response()->json(
                [
                    'message' => 'Success set progerss'
                ]
            );
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function reminderPratestLanguage($id)
    {
        $req = app($this->reminderPratestLanguageValidator);

        $user = User::where('uuid', $id)->first();
     
        $notifdata = ["title" => "Peringatan Pra-Tes Bahasa", "body" => $req->note, "data" => ["module" => "user", "user_id" => $user->uuid]];
        $this->__pushNotification($user, $notifdata);

        return response()->json([
            "status" => "success",
        ], 200);
    }
}
