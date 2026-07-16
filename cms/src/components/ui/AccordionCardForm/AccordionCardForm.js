// src/components/Accordion.js
import React, { useState } from 'react';

const AccordionCardFormItem = ({ title, children, isActive, onItemClick }) => {
  return (
    <div className="mb-4">
      <div
        className="flex items-center gap-1 justify-left py-2 px-4 bg-grey-400 cursor-pointer min-w-[313px] rounded-t-xl"
        onClick={onItemClick}
      >
        <svg
          className={`w-6 h-6 transition-transform transform ${!isActive ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-base text-main-200 leading-6">{title}</span>
      </div>
      {!isActive && <div className="p-4 bg-white rounded-b-xl">{children}</div>}
    </div>
  );
};

const AccordionCardForm = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isActive: index === activeIndex,
            onItemClick: () => handleItemClick(index),
          });
        }
        return null;
      })}
    </div>
  );
};

export { AccordionCardForm, AccordionCardFormItem };
