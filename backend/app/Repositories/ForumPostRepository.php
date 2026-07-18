<?php

namespace App\Repositories;

use App\Repositories\BaseRepository;
use App\Models\Forum\ForumPost;
use Carbon\Carbon;

class ForumPostRepository extends BaseRepository
{
    public function postPopuler()
    {
        $populer = ForumPost::orderByRaw('count_like + count_comment DESC');
        return $populer;
    }

    public function postTrending()
    {
        $fiveDaysAgo = Carbon::now()->subDays(5);

        $trending = ForumPost::where('updated_at', ">=", $fiveDaysAgo)
                    ->whereRaw('count_like + count_comment > 0')
                    ->orderByRaw('count_like + count_comment DESC');
        return $trending;
    }
}
