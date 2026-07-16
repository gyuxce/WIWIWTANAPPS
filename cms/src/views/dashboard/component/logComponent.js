import BoldInsideBracket from 'components/custom/BoldInsideBracket';
import { formatDateFullDMY, formatTime } from 'components/ui/utils/formatter';
import React, { useState } from 'react';

const LogComponent = ({ data, isDashboard }) => {
  //const [isMore, setIsMore] = useState(false);

  const LogData = ({ logs, index }) => {
    const [isMore, setIsMore] = useState(false);

    return logs?.slice(isMore ? 0 : -5, logs?.length).map((det, i) => (
      <React.Fragment key={`detail-${index}-${i}`}>
        <div className="col-span-2 border-r-2 pb-2 text-black text-sm font-normal font-goth leading-[21px]">
          {formatTime(det?.created_at)}
        </div>
        {logs?.length > 0 && (
          <div className="col-span-10 pl-8">
            <span className="text-black text-sm font-normal font-goth leading-[21px]">
              <BoldInsideBracket text={det?.description} />
            </span>
            {i === 4 && isMore === false && !isDashboard && (
              <div
                className="mt-5"
                onClick={() => {
                  setIsMore(!isMore);
                }}
              >
                <span className="text-black text-sm font-bold font-goth leading-[21px]">Lihat Lebih Banyak</span>
              </div>
            )}

            {isMore === true && i === logs?.length - 1 && logs?.length > 5 && !isDashboard && (
              <div
                className="mt-5"
                onClick={() => {
                  setIsMore(!isMore);
                }}
              >
                <span className="text-black text-sm font-bold font-goth leading-[21px]">Lihat Lebih Sedikit</span>
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="grid grid-cols-12">
      {data?.map((aktivitas, index) => (
        <React.Fragment key={index}>
          <div className="col-span-2 border-r-2 pt-8 flex items-center space-x-1 pb-2">
            <div className="flex items-center justify-center h-3 mb-1">
              <img src="/img/icon/calendar.svg" alt="" />
            </div>
            <p className="font-bold text-blue-950 text-sm font-goth leading-[21px]">
              {formatDateFullDMY(aktivitas?.group_date)}
            </p>
          </div>

          <div className="col-span-10"></div>

          <LogData logs={aktivitas?.logs} key={index} index={index} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default LogComponent;
