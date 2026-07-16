<?php

namespace App\Models\Finance;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Training\Program;
use App\Models\Base\User;
use App\Models\Base\File;

class BatchUser extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'batch_users';

    protected $fillable = [
        "uuid",
        "batch_id",
        "program_id",
        "user_id",
        "number",
        "from",
        "to",
        "remarks",
        "file_id",
        "status",
        "transaction_id",
        "transaction_status",
        "transaction_last_at",
        "transaction_due_at",
        "transaction2_id",
        "transaction2_status",
        "transaction2_last_at",
        "transaction2_due_at",
        "payment_type_administration",
        "payment_type_training",
    ];

    protected $hidden = [];

    protected $casts = [];

    const RELATIONS = [
        "user" => ["table" => "users", "field" => "user_id"],
        "program" => ["table" => "programs", "field" => "program_id"],
    ];

    public function program()
    {
        return $this->belongsTo(Program::class, "program_id")->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class, "user_id")->withTrashed();
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class, "batch_id")->withTrashed();
    }

    public function transactionAdministration()
    {
        return $this->belongsTo(Transaction::class, "transaction_id");
    }

    public function transactionTraining()
    {
        return $this->belongsTo(Transaction::class, "transaction2_id");
    }

    public function file()
    {
        return $this->belongsTo(File::class, "file_id")->withTrashed();
    }
}
