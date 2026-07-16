<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\BaseCrud\Traits\HasBaseTable;
use App\Services\BaseCrud\Traits\HasBaseOwner;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;

class File extends Model
{

    use HasFactory, HasBaseTable, HasBaseOwner;
    use SoftDeletes;

    protected $table = 'files';

    protected $fillable = [
        "uuid",
        "name",
        "filename",
        "adapter",
        "url",
        "local_url",
        "height",
        "width",
        "size",
    ];

    protected $hidden = [];

    protected $casts = [];

    // using uuid from this laravel document https://laravel.com/docs/10.x/eloquent#uuid-and-ulid-keys
    /**
    * Generate a new UUID for the model.
    */
    public function newUniqueId(): string
    {
        return (string) Uuid::uuid4();
    }

    /**
    * Get the columns that should receive a unique identifier.
    *
    * @return array<int, string>
    */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

}
