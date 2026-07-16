<?php

namespace App\Models\Finance;

use App\Models\Base\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Training\Program;

class Price extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'prices';

    protected $fillable = [
        "uuid",
        "type",
        "subtype",
        "program_id",
        "type_label",
        "amount",
        "training_letter_file_id",
        "installment_letter_file_id",
    ];

    protected $hidden = [];

    protected $casts = [];

    const RELATIONS = [
        "program" => ["table" => "programs", "field" => "program_id"],
    ];

    public function program()
    {
        return $this->belongsTo(Program::class, "program_id")->withTrashed();
    }

    public function trainingLetter()
    {
        return $this->belongsTo(File::class, "training_letter_file_id")->withTrashed();
    }

    public function installmentLetter()
    {
        return $this->belongsTo(File::class, "installment_letter_file_id")->withTrashed();
    }
}
