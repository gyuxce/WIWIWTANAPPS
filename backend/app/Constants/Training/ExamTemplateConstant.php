<?php

namespace App\Constants\Training;

class ExamTemplateConstant
{

    const ASSESMENT_QUESTION = 1;
    const PRATEST_LANGUAGE = 2;
    const PRATEST_QNA = 3;
    const PRATEST_CHARACTER = 4;
    const ASSESMENT_CONVERSATION = 5;


    const LIST = [
        self::ASSESMENT_QUESTION => 'Assesmen soal',
        self::PRATEST_LANGUAGE => 'Pratest bahasa',
        self::PRATEST_QNA => 'Pratest qna',
        self::PRATEST_CHARACTER => 'Pratest karakter',
        self::ASSESMENT_CONVERSATION => 'Assesmen lisan',

    ];
}
