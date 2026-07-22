<?php

namespace Database\Seeders;

use App\Models\Training\CourseItem;
use Illuminate\Database\Seeder;

class UpdateCourseItemJapaneseTitlesSeeder extends Seeder
{
    public function run(): void
    {
        $titles = [
            'Bahasa Jepang Dasar' => '初級日本語',
            'Bahasa Jepang Menengah' => '中級日本語',
            'Bahasa Jepang 1' => '日本語1',
            'Bahasa Jepang 2' => '日本語2',
            'Katakana' => 'カタカナ',
            'Translate' => '翻訳',
            'Komunikasi bisnis' => 'ビジネスコミュニケーション',
            'Cara pijat sesuai standar' => '標準的なマッサージ方法',
            'Bersopan santun' => '礼儀作法',
            'Belajar mendengar' => 'リスニング学習',
            'Bahasa jepang dasar asesmen soal' => '初級日本語 筆記評価',
            'Bahasa Jepang dasar asesmen lisan' => '初級日本語 口頭評価',
        ];

        foreach ($titles as $title => $titleJapan) {
            CourseItem::where('title', $title)
                ->where(function ($query) {
                    $query->whereNull('title_japan')
                        ->orWhere('title_japan', '');
                })
                ->update(['title_japan' => $titleJapan]);
        }
    }
}
