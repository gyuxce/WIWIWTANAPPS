import React from 'react';
import Progress from 'components/ui/Progress'
const ProgressComponent = ({ title, percent }) => {
  return (
     <div className="">
        <div className="flex items-center justify-between mb-2">
          <p className="text-black text-sm font-bold font-goth leading-[21px]">
            {title}
          </p>
          <p className="text-black text-sm font-bold font-goth leading-[21px]">
            {percent} % Selesai
          </p>
        </div>
      <div>
        <Progress size="lg" color="indigo-500" showInfo={false} percent={percent} />
      </div>
      
    </div>
  );
};

export default ProgressComponent;
