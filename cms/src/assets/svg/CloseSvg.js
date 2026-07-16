import React from 'react';

function CloseSvg({ className }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_9194_26124"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="3"
        y="3"
        width="22"
        height="22"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.9943 5.32664C24.3588 4.96215 24.3588 4.37119 23.9943 4.0067C23.6299 3.64222 23.0389 3.64222 22.6744 4.0067L14.001 12.6801L5.32767 4.0067C4.96319 3.64222 4.37223 3.64222 4.00774 4.0067C3.64325 4.37119 3.64325 4.96215 4.00774 5.32664L12.6811 14L4.00774 22.6734C3.64325 23.0379 3.64325 23.6288 4.00774 23.9933C4.37223 24.3578 4.96319 24.3578 5.32767 23.9933L14.001 15.3199L22.6744 23.9933C23.0389 24.3578 23.6299 24.3578 23.9943 23.9933C24.3588 23.6288 24.3588 23.0379 23.9943 22.6734L15.321 14L23.9943 5.32664Z"
          fill="#0891B2"
        />
      </mask>
      <g mask="url(#mask0_9194_26124)">
        <rect width="28" height="28" fill="black" />
      </g>
    </svg>
  );
}

export default CloseSvg;
