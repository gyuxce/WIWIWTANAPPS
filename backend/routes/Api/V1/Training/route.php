<?php

use App\Http\Controllers\Api\V1\Base\StudentProgressController;
use Illuminate\Support\Facades\Route;

use App\Http\Middleware\Dolphin;
use App\Http\Controllers\Api\V1\Training\QuestionController;
use App\Http\Controllers\Api\V1\Training\QuestionItemController;
use App\Http\Controllers\Api\V1\Training\ExamTemplateController;
use App\Http\Controllers\Api\V1\Training\ExamTemplateItemController;
use App\Http\Controllers\Api\V1\Training\EventController;
use App\Http\Controllers\Api\V1\Training\ArticleController;
use App\Http\Controllers\Api\V1\Training\AssesmentVerbalController;
use App\Http\Controllers\Api\V1\Training\CourseController;
use App\Http\Controllers\Api\V1\Training\CourseItemController;
use App\Http\Controllers\Api\V1\Training\CourseItemVirtualClassController;
use App\Http\Controllers\Api\V1\Training\UserCourseController;
use App\Http\Controllers\Api\V1\Training\UserCourseItemController;
use App\Http\Controllers\Api\V1\Training\UserExamController;
use App\Http\Controllers\Api\V1\Training\UserExamQuestionController;
use App\Http\Controllers\Api\V1\Training\UserExamQuestionItemController;
use App\Http\Controllers\Api\V1\Training\DocumentController;
use App\Http\Controllers\Api\V1\Training\InterviewController;
use App\Http\Controllers\Api\V1\Training\ProgramController;
use App\Http\Controllers\Api\V1\Training\StudentReportController;
use App\Http\Middleware\MobileAccess;

Route::prefix("training")->group(function () {
    Route::prefix("questions")->group(function () {
        Route::get('/', [QuestionController::class, 'index']);
        Route::get('/{id}', [QuestionController::class, 'show']);
        Route::post('/', [QuestionController::class, 'store']);
        Route::put('/{id}', [QuestionController::class, 'update']);
        Route::delete('/{id}', [QuestionController::class, 'destroy']);
    });

    Route::prefix("question-items")->group(function () {
        Route::get('/', [QuestionItemController::class, 'index']);
        Route::get('/{id}', [QuestionItemController::class, 'show']);
        Route::post('/', [QuestionItemController::class, 'store']);
        Route::put('/{id}', [QuestionItemController::class, 'update']);
        Route::delete('/{id}', [QuestionItemController::class, 'destroy']);
    });

    Route::prefix("exam-templates")->group(function () {
        Route::get('/', [ExamTemplateController::class, 'index']);
        Route::get('/{id}', [ExamTemplateController::class, 'show']);
        Route::post('/', [ExamTemplateController::class, 'store']);
        Route::put('/{id}', [ExamTemplateController::class, 'update']);
        Route::delete('/{id}', [ExamTemplateController::class, 'destroy']);
    });

    Route::prefix("exam-template-items")->middleware([Dolphin::class])->group(function () {
        Route::post('/question', [ExamTemplateItemController::class, 'questionCreate']);
        Route::get('/question/{sesi_question_id}', [ExamTemplateItemController::class, 'questionShow']);
        Route::post('/pratest/language', [ExamTemplateItemController::class, 'praTestLanguage']);
        Route::post('/pratest/character', [ExamTemplateItemController::class, 'praTestCharacter']);
        Route::post('/pratest/qna', [ExamTemplateItemController::class, 'praTestQna']);
        Route::get('/pratest', [ExamTemplateItemController::class, 'getPraTest']);
        Route::get('/', [ExamTemplateItemController::class, 'index']);
        Route::get('/{id}', [ExamTemplateItemController::class, 'show']);
        Route::post('/', [ExamTemplateItemController::class, 'store']);
        Route::put('/{id}', [ExamTemplateItemController::class, 'update']);
        Route::delete('/{id}', [ExamTemplateItemController::class, 'destroy']);
    });

    Route::prefix("events")->group(function () {
        Route::get('/', [EventController::class, 'index']);
        Route::get('/{id}', [EventController::class, 'show']);
        Route::post('/', [EventController::class, 'store']);
        Route::put('/{id}', [EventController::class, 'update']);
        Route::delete('/{id}', [EventController::class, 'destroy']);
    });

    Route::prefix("articles")->group(function () {
        Route::get('/', [ArticleController::class, 'index']);
        Route::get('/{id}', [ArticleController::class, 'show']);
        Route::post('/', [ArticleController::class, 'store']);
        Route::put('/{id}', [ArticleController::class, 'update']);
        Route::delete('/{id}', [ArticleController::class, 'destroy']);
    });

    Route::prefix("courses")->middleware(Dolphin::class)->group(function () {
        Route::get('/', [CourseController::class, 'index']);
        Route::get('/export', [CourseController::class, 'export']);
        Route::get('/{id}', [CourseController::class, 'show']);
        Route::post('/', [CourseController::class, 'store']);
        Route::put('/{id}', [CourseController::class, 'update']);
        Route::delete('/{id}', [CourseController::class, 'destroy']);
    });

    Route::prefix("course-items")->middleware(Dolphin::class)->group(function () {
        Route::prefix("module")->group(function () {
            Route::get('/', [CourseItemController::class, 'index']);
            Route::get('/export', [CourseItemController::class, 'export']);
            Route::get('/{id}', [CourseItemController::class, 'show']);
            Route::post('/', [CourseItemController::class, 'store']);
            Route::post('/content-material', [CourseItemController::class, 'createMateri']);
            Route::post('/update_status', [CourseItemController::class, 'updateStatus']);
            Route::post('/upload_file', [CourseItemController::class, 'uploadFile']);
            Route::put('/{id}', [CourseItemController::class, 'update']);
            Route::delete('/{id}', [CourseItemController::class, 'destroy']);
        });

        Route::prefix("virtual-class")->group(function () {
            Route::get('/', [CourseItemVirtualClassController::class, 'index']);
            Route::get('/{id}', [CourseItemVirtualClassController::class, 'show']);
            Route::post('/', [CourseItemVirtualClassController::class, 'store']);
            Route::put('/{id}', [CourseItemVirtualClassController::class, 'update']);
            Route::delete('/{id}', [CourseItemVirtualClassController::class, 'destroy']);
        });
    });

    Route::prefix("user-courses")->group(function () {
        Route::get('/', [UserCourseController::class, 'index']);
        Route::get('/{id}', [UserCourseController::class, 'show']);
        Route::post('/', [UserCourseController::class, 'store']);
        Route::put('/{id}', [UserCourseController::class, 'update']);
        Route::delete('/{id}', [UserCourseController::class, 'destroy']);
    });

    Route::prefix("user-course-items")->group(function () {
        Route::get('/', [UserCourseItemController::class, 'index']);
        Route::get('/{id}', [UserCourseItemController::class, 'show']);
        Route::post('/', [UserCourseItemController::class, 'store']);
        Route::put('/{id}', [UserCourseItemController::class, 'update']);
        Route::delete('/{id}', [UserCourseItemController::class, 'destroy']);
    });

    Route::prefix("user-exams")->middleware([Dolphin::class])->group(function () {
        Route::get('/', [UserExamController::class, 'index']);
        Route::get('/export', [UserExamController::class, 'export']);
        Route::get('/{id}', [UserExamController::class, 'show']);
        Route::post('/', [UserExamController::class, 'store']);
        Route::put('/{id}', [UserExamController::class, 'update']);
        Route::delete('/{id}', [UserExamController::class, 'destroy']);
        Route::post('/reminder-pratest-language/{id}', [UserExamController::class, 'reminderPratestLanguage']);
    });

    Route::prefix("user-exam-questions")->group(function () {
        Route::get('/', [UserExamQuestionController::class, 'index']);
        Route::get('/{id}', [UserExamQuestionController::class, 'show']);
        Route::post('/', [UserExamQuestionController::class, 'store']);
        Route::put('/{id}', [UserExamQuestionController::class, 'update']);
        Route::delete('/{id}', [UserExamQuestionController::class, 'destroy']);
    });

    Route::prefix("student-report")->middleware([Dolphin::class])->group(function () {

        Route::get('/', [StudentReportController::class, 'index']);
        Route::get('/export', [StudentReportController::class, 'export']);
        Route::get('/{id}', [StudentReportController::class, 'show']);
        Route::get('/detail/{id}', [StudentReportController::class, 'detailStudentReport']);
        Route::put('/{id}', [StudentReportController::class, 'update']);
        Route::get('history/{id}', [StudentReportController::class, 'detailHistory']);
        Route::get('/detail/export/{id}', [StudentReportController::class, 'detailExport']);
        Route::post('/update-report', [StudentReportController::class, 'updateStudentReport']);
        Route::post('/update-report-assesment-verbal', [StudentReportController::class, 'updateStudentReportAssesmentVerbal']);
        Route::post('/repeat-assesment', [StudentReportController::class, 'repeatAssesment']);
        Route::post('/repeat-assesment-verbal', [StudentReportController::class, 'repeatAssesmentVerbal']);
    });

    Route::prefix("assesment-verbal")->middleware([Dolphin::class])->group(function () {
        Route::get('/{id}', [AssesmentVerbalController::class, 'indexAssesmentVerbal']);
        Route::get('/export/{id}', [AssesmentVerbalController::class, 'export']);
        Route::get('/detail/{id}', [AssesmentVerbalController::class, 'show']);
        Route::put('/{id}', [AssesmentVerbalController::class, 'updateAssement']);
        Route::get('/{id}/score-minimum', [AssesmentVerbalController::class, 'getScoreMinimum']);
        Route::put('/{id}/score-minimum', [AssesmentVerbalController::class, 'updateScoreMinimum']);
    });

    Route::prefix("user-exam-question-items")->group(function () {
        Route::get('/', [UserExamQuestionItemController::class, 'index']);
        Route::get('/{id}', [UserExamQuestionItemController::class, 'show']);
        Route::post('/', [UserExamQuestionItemController::class, 'store']);
        Route::put('/{id}', [UserExamQuestionItemController::class, 'update']);
        Route::delete('/{id}', [UserExamQuestionItemController::class, 'destroy']);
    });

    Route::prefix("documents")->group(function () {
        Route::get('/', [DocumentController::class, 'index']);
        Route::get('/{id}', [DocumentController::class, 'show']);
        Route::post('/', [DocumentController::class, 'store']);
        Route::put('/{id}', [DocumentController::class, 'update']);
        Route::delete('/{id}', [DocumentController::class, 'destroy']);
    });

    Route::prefix("programs")->group(function () {
        Route::get('/', [ProgramController::class, 'index']);
        Route::get('/{id}', [ProgramController::class, 'show']);
        Route::post('/', [ProgramController::class, 'store']);
        Route::put('/{id}', [ProgramController::class, 'update']);
        Route::delete('/{id}', [ProgramController::class, 'destroy']);
    });

    Route::prefix("interviews")->middleware([Dolphin::class])->group(function () {
        Route::get('/', [InterviewController::class, 'index']);
        Route::get('/export', [InterviewController::class, 'export']);
        Route::get('/{id}', [InterviewController::class, 'show']);
        Route::post('/', [InterviewController::class, 'store']);
        Route::put('/{id}', [InterviewController::class, 'update']);
        Route::delete('/{id}', [InterviewController::class, 'destroy']);
    });
});

Route::prefix("mobile")->group(function () {
    Route::prefix("training")->group(function () {
        Route::prefix("user-exams")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/progress', [UserExamController::class, 'getUserExamProgress']);
            Route::post('/set-session', [UserExamController::class, 'mobileSetSessionLanguage']);
            Route::put('/schedule/{id}', [UserExamController::class, 'mobileSetShceduleQna']);
            Route::get('/schedule/{id}', [UserExamController::class, 'mobileShowSchedule']);
            Route::post('/set-status', [UserExamController::class, 'mobileFinishedPratest']);
        });

        Route::prefix("pratest")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/bahasa', [ExamTemplateItemController::class, 'getPraTestBahasaMobile']);
            Route::get('/karakter', [ExamTemplateItemController::class, 'getPraTestKarakterMobile']);
            Route::get('/qna', [ExamTemplateItemController::class, 'getPraTestKarakterMobile']);
        });

        Route::prefix("question")->group(function () {
            Route::get('/{sesi_question_id}', [QuestionItemController::class, 'getQuestionMobile'])->middleware([Dolphin::class]);
            Route::post('/', [QuestionItemController::class, 'answerQuestionAdd'])->middleware([Dolphin::class]);
            Route::put('/{id}', [QuestionItemController::class, 'answerQuestionUpdate'])->middleware([Dolphin::class]);
        });

        Route::prefix("module")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/progress', [CourseItemController::class, 'mobileGetModuleProgress']);
            Route::get('/materi/detail', [CourseItemController::class, 'mobileGetModuleDetail']);
            Route::get('/materi/detail/{module_id}', [CourseItemController::class, 'mobileGetModuleDetailAll']);
            Route::get('/materi/virtual-class', [CourseItemController::class, 'mobileGetModuleVirtualClass']);
            Route::get('/materi/assesment', [CourseItemController::class, 'mobileGetModuleAssesment']);
            Route::get('/materi/assesment/question/{module_id}', [CourseItemController::class, 'mobileGetQuestionAssesmentRandom']);
            Route::get('/materi/content', [CourseItemController::class, 'mobileGetModuleContentMateri']);
            Route::post('/materi', [CourseItemController::class, 'mobileUpdateProgressModuleContentMaterial']);
            Route::post('/update-status', [UserCourseItemController::class, 'updateStatus']);
        });

        Route::prefix("final-interview")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/', [InterviewController::class, 'mobileGetUserInterview']);
        });
    });
});
