<?php

namespace App\Models\Finance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Training\Program;

class Batch extends Model {

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'batches';

    protected $fillable =[
        "uuid",
        "title",
        "period",
        "from",
        "to",
        "program_id",
        "remarks",
        "capacity",
    ];

    protected $hidden =[
    ];

    protected $casts =[
    ];

    public function program() {
        return $this->belongsTo(Program::class,"program_id")->withTrashed();
    }

}