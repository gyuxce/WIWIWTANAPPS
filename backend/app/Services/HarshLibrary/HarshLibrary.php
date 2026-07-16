<?php

namespace App\Services\HarshLibrary;

use Illuminate\Support\Str;
use App\Models\Base\HarshWord;

class HarshLibrary
{
    public function detectHarshWord($sentence)
    {
        $hashWords = HarshWord::pluck('name')->toArray();
        $sentenceLower = strtolower($sentence);
        foreach ($hashWords as $hashWord) {
            $hashWordLower = strtolower($hashWord);
            if (strpos($sentenceLower, $hashWordLower) !== false) {
                return true;
            }
        }

        return false;
    }
}