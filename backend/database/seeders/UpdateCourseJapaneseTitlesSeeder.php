<?php

namespace Database\Seeders;

use App\Models\Training\Course;
use Illuminate\Database\Seeder;

class UpdateCourseJapaneseTitlesSeeder extends Seeder
{
    public function run(): void
    {
        $titles = [
            'Teori Bahasa Jepang' => '日本語理論',
            'Praktik Bahasa Jepang' => '日本語実践',
            'Soft Skill Bahasa Jepang' => '日本語ソフトスキル',
        ];

        foreach ($titles as $title => $titleJapan) {
            Course::where('title', $title)
                ->where(function ($query) {
                    $query->whereNull('title_japan')
                        ->orWhere('title_japan', '');
                })
                ->update(['title_japan' => $titleJapan]);
        }
    }
}
