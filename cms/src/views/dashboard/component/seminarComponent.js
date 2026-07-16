import React from 'react';
const SeminarComponent = ({ title, date, imageUrl }) => {
  return (
    <div className="flex items-center space-x-2">
      <div>
        <img src={imageUrl} className="w-[42px] h-[42px] rounded border border-black" alt=""/>
      </div>
      <div className="">
        <p className="w-full md:w-[247px] text-black text-sm font-bold font-goth leading-[21px] mb-1 truncate">{title}</p>
        <div className="flex items-center space-x-1">
          <div className="flex items-center justify-center h-3 mb-1">
            <img src="/img/icon/calendar-mark2.svg" alt="" className="text-red-500" />
          </div>
          <p className="text-black text-xs font-normal font-century-gothic">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default SeminarComponent;
