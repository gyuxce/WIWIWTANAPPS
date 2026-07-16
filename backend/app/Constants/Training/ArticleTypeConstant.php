<?php

namespace App\Constants\Training;

class ArticleTypeConstant
{

    const ARTICLE_TYPE_VIDEO = 1;
    const ARTICLE_TYPE_DOC = 2;
    const ARTICLE_TYPE_TEKS = 3;

    const LIST = [
        self::ARTICLE_TYPE_VIDEO => 'Materi Video',
        self::ARTICLE_TYPE_DOC => 'Lampiran Dokumen',
        self::ARTICLE_TYPE_TEKS => 'Teks Editor',
    ];
}
