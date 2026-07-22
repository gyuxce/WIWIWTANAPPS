<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Base\User;
use App\Models\Forum\ForumPost;
use App\Models\Master\Notification;
use App\Services\Excel\Excel;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DevDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (ENV('APP_ENV') == 'local') {
            ini_set('memory_limit', '2048M');
            // $this->call(DatabaseSeeder::class);

            $excel = new Excel();
            $file = base_path() . '/database/seeders/data/dev_data.xlsx';
            $excel->excelSeeder($file);
            $this->call(UpdateCourseJapaneseTitlesSeeder::class);

            $this->dummySeederNotification();
        }
    }

    public function dummySeederNotification()
    {

        for ($i=1; $i <= 5; $i++) {
            $input = [
                "category" => "content",
                "title" => "notification",
                "body" => "[Dummy Notification ".$i."] Pastikan dirimu tetap mengikuti kelas virtual yang ada ya! Semangat!",
                "priority" => 1,
                "user_id" => 3,
                "data" => null,
            ];

            $q = Notification::query();
            $q->create($input);
        }

        # komentar
        $forumPost = ForumPost::all();
        $siswa = User::whereNull('role_id')->get();
        foreach ($forumPost as $key => $value) {
            foreach ($siswa as $ks => $vs) {
                $input = [
                    "category" => "forum-comment",
                    "title" => "Comment",
                    "body" => "[".$value->title."] Anda mendapatkan komentar dari [".$vs->name."]",
                    "priority" => 0,
                    "user_id" => 3,
                    "data" => [
                        "module" => "forum-comment",
                        "comment" => "comment test",
                        "post_id" => $value->uuid,
                        "comment_id" => null,
                    ],
                ];

                $q = Notification::query();
                $q->create($input);
            }
        }
    }
}
