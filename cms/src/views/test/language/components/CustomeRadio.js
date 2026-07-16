import React from 'react';

const CustomeRadio = ({ selected }) => {
  return (
    <div className="justify-start items-end gap-2 cursor-pointer">
      <div
        className={`w-5 h-5 rounded-full border ${
          selected ? 'border-blue-950 ' : 'border-stone-200'
        }flex items-center justify-center`}
      >
        {selected ? <div className="w-3 h-3 bg-blue-950 rounded-full"></div> : null}
      </div>
    </div>
  );
};

export default CustomeRadio;
