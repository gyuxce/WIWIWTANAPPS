// src/components/Accordion.js
import React, { useState } from 'react';

const AccordionItem = ({ title, children, isActive, onItemClick }) => {
  return (
    <div className="">
      <div
        className="flex items-center justify-between py-4 bg-white cursor-pointer border-b-[1px] border-b-second-600"
        onClick={onItemClick}
      >
        <span className="text-xl text-main-400">{title}</span>
        <svg
          className={`w-6 h-6 transition-transform transform ${isActive ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isActive && <div className=" bg-white">{children}</div>}
    </div>
  );
};

const Accordion = ({ children, defaultActiveIndex = null }) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

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

export { Accordion, AccordionItem };
