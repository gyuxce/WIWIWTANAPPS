import React from 'react';
import { Card } from 'components/ui';
const CardComponent = ({ title, value, imageUrl }) => {
  return (
    <Card className="bg-white rounded-xl border-none">
      <div className="flex items-center justify-between ">
         <div className="">
          <div className="text-stone-400 text-sm font-normal font-goth leading-[21px]">{title}</div>
          <div className="text-blue-950 text-[28px] font-normal font-opificio">{value}</div>
        </div>
        <div className="">
          <img src={imageUrl} alt="" className="w-[60px] h-[60px] bg-indigo-50 rounded-xl"/>
        </div>
      </div>
     
    </Card>
  );
};

export default CardComponent;
