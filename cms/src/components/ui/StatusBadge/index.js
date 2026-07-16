import React from 'react';

const StatusBadge = ({ color = 'blue', text = '-' }) => {
  return (
    <div>
      <span
        className={`px-3 py-2 bg-${color}-50 rounded-full border border-${color}-500 text-${color}-500 text-xs font-normal font-goth`}
      >
        {text}
      </span>
    </div>
  );
};

export default StatusBadge;
