import React from 'react';

const QuestionNotFound = ({ questions }) => {
  return (
    <div className="w-full  h-[323px] py-[120px] bg-white rounded-xl flex-col justify-center items-center inline-flex">
      <div className="text-center text-black text-xl font-normal font-opificio">
        {questions?.length > 0 ? 'Silahkan pilih soal' : 'Belum ada data'}
      </div>
    </div>
  );
};

export default QuestionNotFound;
