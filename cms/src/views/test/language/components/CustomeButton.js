import React from 'react';

const CustomeButton = ({ onClick,title,img_url }) => {
  return (
    <div>
      <div className="px-3 py-2 rounded border border-black">
        <div className="flex items-center justify-center space-x-2 cursor-pointer" onClick={onClick}>
          <img src={img_url} alt="" />
          <span className="text-center text-black text-xs font-normal font-goth">{title}</span>
        </div>
      </div>
    </div>
    
  );
};

export default CustomeButton;