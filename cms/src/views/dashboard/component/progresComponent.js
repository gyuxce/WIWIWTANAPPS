import React from 'react';
import Progress from 'components/ui/Progress'
const ProgressComponent = ({ title, percent }) => {
  const progressValue = Number(percent) || 0;

  return (
     <div className="">
        <div className="flex items-center justify-between mb-2">
          <p className="text-black text-sm font-bold font-goth leading-[21px]">
            {title}
          </p>
          <p className="text-black text-sm font-bold font-goth leading-[21px]">
            {progressValue} % Selesai
          </p>
        </div>
      <div>
        <Progress size="md" color="indigo-500" showInfo={false} percent={progressValue} />
      </div>
      
    </div>
  );
};

export default ProgressComponent;
