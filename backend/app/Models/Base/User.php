<?php

namespace App\Models\Base;

use App\Constants\Training\ExamTemplateConstant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Carbon;
use App\Models\Master\Cities;
use App\Models\Base\UserFiles;
use App\Models\Finance\BatchUser;
use App\Models\Finance\Transaction;
use App\Models\Master\CertificationStudent;
use App\Models\Master\Province;
use App\Models\Training\Interview;
use App\Models\Training\ExamTemplateItem;
use App\Models\Training\UserArticle;
use App\Models\Training\UserCourse;
use App\Models\Training\UserExam;

class User extends Authenticatable
{

    use Notifiable;
    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 1;

    const LABEL_STATUS = [
        self::STATUS_INACTIVE => 'Inactive',
        self::STATUS_ACTIVE => 'Active',
    ];
    const LABEL_STATUS_STUDENT = [
        self::STATUS_INACTIVE => 'Tidak Aktif',
        self::STATUS_ACTIVE => 'Aktif',
    ];

    const STATUS_TRAINING_NO = 0;
    const STATUS_TRAINING_YES = 1;

    const LABEL_STATUS_TRAINING = [
        self::STATUS_TRAINING_NO => 'Belum Yakin',
        self::STATUS_TRAINING_YES => 'Ya',
    ];

    protected $table = 'users';

    protected $fillable = [
        "uuid",
        "name",
        "google_id",
        "facebook_id",
        "apple_id",
        "name_alias",
        "email",
        "email_verified_at",
        "password_updated_at",
        "password",
        "username",
        "is_active",
        "active_date",
        "remember_token",
        "phone",
        "address",
        "city_id",
        "role_id",
        "birthplace",
        "dob",
        "blood_type",
        "last_education",
        "ethnic_origin",
        "is_training",
        "training_program",
        "register_information",
        "other_register_information",
        "study_program",
        "certificate_id",
        "cv_id",
        "profile_pic_id",
        "id_card",
        "count_login_attempt",
        "join_reason",
        "join_date",
        "interview_status",
        "interview_count",
        "current_sesi_language_id",
        "last_phase",
        "last_level",
        "pg_data",
        'customer_id',
        'is_subscription_active',
    ];

    protected $hidden = [
        "password",
        "remember_token",
    ];

    protected $casts = [];
    const RELATIONS = [
        "city" => ["table" => "cities", "field" => "city_id"],
        "province" => ["table" => "province", "field" => "province_id"],
        "role" => ["table" => "roles", "field" => "role_id"],
    ];


    public function token()
    {
        return $this->hasOne(\App\Models\Base\Token::class)->where('is_blocked', 0)->where('expires_at', '>', Carbon::now());
    }

    public function fcm_tokens()
    {
        return $this->hasMany(\App\Models\Base\FcmToken::class, 'user_id');
    }

    public function city()
    {
        return $this->belongsTo(Cities::class, 'city_id');
    }
    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function certificate()
    {
        return $this->belongsTo(File::class, 'certificate_id');
    }

    public function cv()
    {
        return $this->belongsTo(File::class, 'cv_id');
    }

    public function profilePicture()
    {
        return $this->belongsTo(File::class, 'profile_pic_id');
    }

    public function userFiles()
    {
        return $this->hasMany(UserFiles::class, 'user_id')->with('file')->where('status', true);
    }

    public function examTestBahasa()
    {
        return $this->hasOne(UserExam::class, 'user_id')->where('template_id', 2)->where('status', 1);
    }
    public function examTestKarakter()
    {
        return $this->hasOne(UserExam::class, 'user_id')->where('template_id', 4)->where('status', 1);
    }

    public function course()
    {
        return $this->hasOne(UserCourse::class, 'user_id');
    }

    public function interviews()
    {
        return $this->hasMany(Interview::class, 'user_id');
    }

    public function currentSessionLanguage()
    {
        return $this->belongsTo(ExamTemplateItem::class, 'current_sesi_language_id');
    }

    public function userExam()
    {
        return $this->hasMany(UserExam::class, 'user_id');
    }

    public function userArticle()
    {
        return $this->hasMany(UserArticle::class, 'user_id');
    }

    public function userBatch()
    {
        return $this->hasOne(BatchUser::class, 'user_id');
    }

    public function certifications()
    {
        return $this->hasMany(CertificationStudent::class, 'user_id');
    }

    public function pratestLanguage()
    {
        return $this->hasOne(UserExam::class, 'user_id')->where('template_id', ExamTemplateConstant::PRATEST_LANGUAGE);
    }
    public function pratestCharacter()
    {
        return $this->hasOne(UserExam::class, 'user_id')->where('template_id', ExamTemplateConstant::PRATEST_CHARACTER);
    }
    public function pratestQna()
    {
        return $this->hasOne(UserExam::class, 'user_id')->where('template_id', ExamTemplateConstant::PRATEST_QNA);
    }
}
